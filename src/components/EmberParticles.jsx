import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';

const COUNT = 150; // Constant count to prevent WebGL buffer attribute resizing crashes

function Embers() {
  const pointsRef = useRef();
  const { viewport } = useThree();
  const scrollProgress = useScrollProgress();
  const isMobile = window.innerWidth <= 768;
  const count = COUNT;

  // Initialize particles once on mount
  const { positions, speeds, offsets, colors, sides } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const sde = new Float32Array(count); // 0 = left edge, 1 = right edge, 2 = center bottom

    const emberColors = [
      new THREE.Color(0xff2200), // Flame red-orange
      new THREE.Color(0xff5500), // Intense orange
      new THREE.Color(0xff8800), // Bright amber
      new THREE.Color(0xffaa00), // Hot yellow
      new THREE.Color(0xffdd44), // Golden core
    ];

    const w = 20;
    const h = 12;

    for (let i = 0; i < count; i++) {
      // Divide particles equally: 1/3 left, 1/3 right, 1/3 center bottom
      let sideVal = 0;
      if (i < count / 3) {
        sideVal = 0;
      } else if (i < (2 * count) / 3) {
        sideVal = 1;
      } else {
        sideVal = 2;
      }
      sde[i] = sideVal;

      if (sideVal === 0) {
        // Left side: X: -w/2 to -w/2 + w*0.25
        const baseVal = -w / 2;
        const spread = Math.random() * (w * 0.25);
        pos[i * 3] = baseVal + spread;
        // Y: full lower screen distribution (-h/2 to h * 0.15)
        pos[i * 3 + 1] = Math.random() * (h * 0.65) - h / 2;
      } else if (sideVal === 1) {
        // Right side: X: w/2 - w*0.25 to w/2
        const baseVal = w / 2;
        const spread = Math.random() * (w * 0.25);
        pos[i * 3] = baseVal - spread;
        // Y: full lower screen distribution (-h/2 to h * 0.15)
        pos[i * 3 + 1] = Math.random() * (h * 0.65) - h / 2;
      } else {
        // Center: X: -w * 0.18 to w * 0.18
        pos[i * 3] = (Math.random() - 0.5) * (w * 0.35);
        // Y: only bottom 20% of screen height (-h/2 to -h/2 + h * 0.20)
        pos[i * 3 + 1] = Math.random() * (h * 0.20) - h / 2;
      }

      // Z: depth variation for parallax
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Vary vertical speeds
      spd[i] = Math.random() * 0.008 + 0.003;
      off[i] = Math.random() * Math.PI * 2;

      // Assign vivid colors
      const c = emberColors[Math.floor(Math.random() * emberColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, speeds: spd, offsets: off, colors: col, sides: sde };
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 245, 200, 1)'); // Hot white-yellow core
    gradient.addColorStop(0.15, 'rgba(255, 140, 20, 0.95)'); // Orange corona
    gradient.addColorStop(0.45, 'rgba(230, 40, 5, 0.45)'); // Fire red halo
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Soft edge
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();
    const { mouse } = state;
    const w = viewport.width;
    const h = viewport.height;

    // Mouse coordinates in Three.js viewport units
    const mouseX = mouse.x * w / 2;
    const mouseY = mouse.y * h / 2;

    const speedMultiplier = 1.0 + scrollProgress * 0.8;
    const swayMultiplier = 1.0 + scrollProgress * 1.0;

    for (let i = 0; i < count; i++) {
      const sideVal = sides[i]; // 0 = Left, 1 = Right, 2 = Center

      // 1. Drift Y upward
      posArr[i * 3 + 1] += speeds[i] * speedMultiplier;

      // 2. Sway X
      const sway = Math.sin(time * 1.2 + offsets[i]) * 0.012 * swayMultiplier;
      posArr[i * 3] += sway;

      // 3. Keep particles strictly within their horizontal bounds
      if (sideVal === 0) {
        // Left side: outer 28% width
        const margin = w * 0.28;
        if (posArr[i * 3] < -w / 2) posArr[i * 3] = -w / 2;
        if (posArr[i * 3] > -w / 2 + margin) posArr[i * 3] = -w / 2 + margin;
      } else if (sideVal === 1) {
        // Right side: outer 28% width
        const margin = w * 0.28;
        if (posArr[i * 3] > w / 2) posArr[i * 3] = w / 2;
        if (posArr[i * 3] < w / 2 - margin) posArr[i * 3] = w / 2 - margin;
      } else {
        // Center bottom: middle 36% width
        const centerBound = w * 0.18;
        if (posArr[i * 3] < -centerBound) posArr[i * 3] = -centerBound;
        if (posArr[i * 3] > centerBound) posArr[i * 3] = centerBound;
      }

      // 4. Mouse Interaction: push particles away from the cursor
      const px = posArr[i * 3];
      const py = posArr[i * 3 + 1];
      const dx = px - mouseX;
      const dy = py - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5) {
        const force = (2.5 - dist) / 2.5;
        posArr[i * 3] += (dx / dist) * force * 0.15;
        posArr[i * 3 + 1] += (dy / dist) * force * 0.15;
      }

      // 5. Reset based on Y thresholds (Sides rise to h*0.15, Center bottom only rises to 18% of screen height)
      const resetThreshold = sideVal === 2 ? -h / 2 + h * 0.18 : h * 0.15;
      if (posArr[i * 3 + 1] > resetThreshold) {
        posArr[i * 3 + 1] = -h / 2 - 0.5; // Start at the bottom of the screen
        
        if (sideVal === 0) {
          const baseVal = -w / 2;
          const spread = Math.random() * (w * 0.25);
          posArr[i * 3] = baseVal + spread;
        } else if (sideVal === 1) {
          const baseVal = w / 2;
          const spread = Math.random() * (w * 0.25);
          posArr[i * 3] = baseVal - spread;
        } else {
          posArr[i * 3] = (Math.random() - 0.5) * (w * 0.35);
        }
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.08 : 0.16}
        vertexColors
        transparent
        opacity={0.85}
        map={particleTexture}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function EmberParticles() {
  return (
    <div className="ember-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <Embers />
      </Canvas>
    </div>
  );
}
