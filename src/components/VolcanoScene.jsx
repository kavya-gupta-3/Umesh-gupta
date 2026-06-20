import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';

/* ============================================================
   VOLCANO GEOMETRY
   ============================================================ */
function Volcano({ scrollProgress }) {
  const volcanoRef = useRef();
  const craterRef = useRef();
  const craterLightRef = useRef();
  const isMobile = window.innerWidth <= 768;

  const segments = isMobile ? 16 : 32;

  // Volcano body
  const volcanoGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(8, 12, segments, 8, true);
    // Add some displacement for rocky feel
    const positions = geo.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      // Only displace sides, not the very top or bottom
      if (y > -5.5 && y < 5) {
        const noise = (Math.random() - 0.5) * 0.4;
        positions[i] += noise;
        positions[i + 2] += noise;
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [segments]);

  const volcanoMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true,
  }), []);

  // Crater (inverted cone at top)
  const craterGeo = useMemo(() => new THREE.ConeGeometry(1.2, 2, segments, 1, true), [segments]);
  const craterMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x2a0a00,
    emissive: 0xE8470A,
    emissiveIntensity: 0.5,
    roughness: 0.5,
    side: THREE.BackSide,
  }), []);

  useFrame(() => {
    if (craterLightRef.current) {
      craterLightRef.current.intensity = THREE.MathUtils.lerp(0, 5, scrollProgress);
    }
    if (craterRef.current) {
      craterRef.current.material.emissiveIntensity = 0.5 + scrollProgress * 1.5;
    }
  });

  return (
    <group ref={volcanoRef}>
      {/* Main volcano body */}
      <mesh geometry={volcanoGeo} material={volcanoMat} position={[0, 0, 0]}>
      </mesh>
      {/* Crater glow inside */}
      <mesh ref={craterRef} geometry={craterGeo} material={craterMat} position={[0, 5.5, 0]} rotation={[Math.PI, 0, 0]} />
      {/* Crater light */}
      <pointLight
        ref={craterLightRef}
        position={[0, 6, 0]}
        color={0xE8470A}
        intensity={0}
        distance={30}
        decay={2}
      />
    </group>
  );
}

/* ============================================================
   ERUPTION PARTICLE SYSTEM
   ============================================================ */
function EruptionParticles({ scrollProgress }) {
  const pointsRef = useRef();
  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 100 : 500;

  const { positions, velocities, colors, sizes, lifetimes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const life = new Float32Array(count);

    const particleColors = [
      new THREE.Color(0xE8470A),
      new THREE.Color(0xff6b35),
      new THREE.Color(0xffcc44),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < count; i++) {
      // Start at crater
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      // Random velocities
      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = Math.random() * 3 + 1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Random color
      const c = particleColors[Math.floor(Math.random() * particleColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = Math.random() * 0.25 + 0.05;
      life[i] = Math.random(); // phase offset
    }

    return { positions: pos, velocities: vel, colors: col, sizes: sz, lifetimes: life };
  }, [count]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,180,50,0.8)');
    gradient.addColorStop(1, 'rgba(255,100,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    const eruptionIntensity = scrollProgress < 0.3
      ? scrollProgress / 0.3 * 0.1
      : scrollProgress < 0.6
        ? 0.1 + ((scrollProgress - 0.3) / 0.3) * 0.5
        : 0.6 + ((scrollProgress - 0.6) / 0.4) * 0.4;

    for (let i = 0; i < count; i++) {
      const phase = lifetimes[i];
      const cycleTime = ((time * 0.5 + phase) % 1);

      if (eruptionIntensity < 0.05) {
        // Shimmer at crater
        posArr[i * 3] = (Math.random() - 0.5) * 0.8;
        posArr[i * 3 + 1] = 6 + Math.sin(time * 3 + phase * 10) * 0.3;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      } else {
        // Active eruption
        const spreadFactor = eruptionIntensity * 3;
        const heightFactor = eruptionIntensity * 8;
        const t = cycleTime;

        // Parabolic trajectory
        const vx = velocities[i * 3] * spreadFactor;
        const vy = velocities[i * 3 + 1] * heightFactor;
        const vz = velocities[i * 3 + 2] * spreadFactor;

        posArr[i * 3] = vx * t;
        posArr[i * 3 + 1] = 6 + vy * t - 9.8 * t * t * eruptionIntensity;
        posArr[i * 3 + 2] = vz * t;

        // Reset particles that fall below ground
        if (posArr[i * 3 + 1] < -6) {
          posArr[i * 3] = (Math.random() - 0.5) * 0.8;
          posArr[i * 3 + 1] = 6;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        }
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
        size={0.25}
        vertexColors
        transparent
        opacity={0.9}
        map={particleTexture}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ============================================================
   LAVA FLOWS
   ============================================================ */
function LavaFlows({ scrollProgress }) {
  const flowRefs = useRef([]);

  const flowPaths = useMemo(() => {
    const paths = [];
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    for (let i = 0; i < 4; i++) {
      const angle = angles[i];
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(Math.sin(angle) * 0.3, 5.5, Math.cos(angle) * 0.3),
        new THREE.Vector3(Math.sin(angle) * 2, 3, Math.cos(angle) * 2),
        new THREE.Vector3(Math.sin(angle) * 4, 0, Math.cos(angle) * 4),
        new THREE.Vector3(Math.sin(angle) * 7, -5.5, Math.cos(angle) * 7),
      );
      paths.push(curve);
    }
    return paths;
  }, []);

  useFrame(() => {
    flowRefs.current.forEach((ref) => {
      if (ref && ref.material) {
        ref.material.emissiveIntensity = THREE.MathUtils.lerp(0, 2.0, scrollProgress);
        ref.material.opacity = 0.3 + scrollProgress * 0.7;
      }
    });
  });

  return (
    <group>
      {flowPaths.map((curve, i) => (
        <mesh
          key={i}
          ref={(el) => { flowRefs.current[i] = el; }}
        >
          <tubeGeometry args={[curve, 20, 0.12, 6, false]} />
          <meshStandardMaterial
            color={0xE8470A}
            emissive={0xff6b35}
            emissiveIntensity={0}
            transparent
            opacity={0.3}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   BACKGROUND PLANE (fallback gradient)
   ============================================================ */
function BackgroundPlane({ scrollProgress }) {
  const meshRef = useRef();
  const [frameTextures, setFrameTextures] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 300;
  const loadedRef = useRef(false);

  // Try to load volcano frames
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const textures = [];
    let loadCount = 0;
    let failed = false;

    // Try loading first frame to see if frames exist
    loader.load(
      '/volcano-frames/frame_0001.jpg',
      (tex) => {
        textures[0] = tex;
        loadCount++;
        // Pre-load remaining frames
        for (let i = 2; i <= totalFrames; i++) {
          const padded = String(i).padStart(4, '0');
          loader.load(
            `/volcano-frames/frame_0${padded}.jpg`,
            (t) => {
              textures[i - 1] = t;
              loadCount++;
              if (loadCount >= 30 && !loadedRef.current) {
                loadedRef.current = true;
                setFrameTextures([...textures]);
              }
              if (loadCount === totalFrames) {
                setFrameTextures([...textures]);
              }
            },
            undefined,
            () => {}
          );
        }
      },
      undefined,
      () => {
        // Frames don't exist, use fallback
        failed = true;
      }
    );
  }, []);

  // Animate frames
  useFrame(() => {
    if (frameTextures.length > 0 && meshRef.current) {
      // Scroll-driven frame playback with parallax
      const frameIndex = Math.floor(scrollProgress * (frameTextures.length - 1));
      const clamped = Math.max(0, Math.min(frameIndex, frameTextures.length - 1));
      if (frameTextures[clamped]) {
        meshRef.current.material.map = frameTextures[clamped];
        meshRef.current.material.needsUpdate = true;
      }
    }
  });

  // Fallback gradient shader
  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uScrollProgress;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec3 darkColor = vec3(0.02, 0.01, 0.0);
          vec3 midColor = vec3(0.15, 0.03, 0.0);
          vec3 hotColor = vec3(0.5, 0.15, 0.02);

          float gradient = smoothstep(0.0, 0.6, vUv.y);
          vec3 baseColor = mix(midColor * (0.3 + uScrollProgress * 0.7), darkColor, gradient);

          // Add subtle glow at bottom
          float glowIntensity = (1.0 - vUv.y) * uScrollProgress * 0.3;
          baseColor += hotColor * glowIntensity;

          // Subtle animated noise
          float noise = fract(sin(dot(vUv * 10.0 + uTime * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
          baseColor += noise * 0.015;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (frameTextures.length === 0 && meshRef.current) {
      gradientMaterial.uniforms.uScrollProgress.value = scrollProgress;
      gradientMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 5, -50]}>
      <planeGeometry args={[100, 60]} />
      {frameTextures.length > 0
        ? <meshBasicMaterial color={0xffffff} />
        : <primitive object={gradientMaterial} attach="material" />
      }
    </mesh>
  );
}

/* ============================================================
   CAMERA CONTROLLER (scroll-driven orbit)
   ============================================================ */
function CameraController({ scrollProgress }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 2, 0));
  const currentAngle = useRef(0);
  const currentY = useRef(4);

  useFrame(() => {
    // Target angle: 0 → 2π (360°)
    const targetAngle = scrollProgress * Math.PI * 2;
    // Smooth lerp
    currentAngle.current += (targetAngle - currentAngle.current) * 0.08;

    // Camera elevation: y goes from 4 to 8
    const targetY = 4 + scrollProgress * 4;
    currentY.current += (targetY - currentY.current) * 0.08;

    const radius = 20;
    camera.position.x = Math.sin(currentAngle.current) * radius;
    camera.position.z = Math.cos(currentAngle.current) * radius;
    camera.position.y = currentY.current;

    camera.lookAt(targetRef.current);
  });

  return null;
}

/* ============================================================
   BASE LAVA LIGHTS
   ============================================================ */
function BaseLavaLights({ scrollProgress }) {
  const lightsRef = useRef([]);
  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

  useFrame(() => {
    lightsRef.current.forEach((light) => {
      if (light) {
        light.intensity = 0.2 + scrollProgress * 1.5;
      }
    });
  });

  return (
    <>
      {angles.map((angle, i) => (
        <pointLight
          key={i}
          ref={(el) => { lightsRef.current[i] = el; }}
          position={[Math.sin(angle) * 7, -5, Math.cos(angle) * 7]}
          color={0xE8470A}
          intensity={0.5}
          distance={15}
          decay={2}
        />
      ))}
    </>
  );
}

/* ============================================================
   MAIN SCENE COMPONENT
   ============================================================ */
export default function VolcanoScene() {
  const scrollProgress = useScrollProgress();

  return (
    <div className="volcano-canvas-container">
      <Canvas
        camera={{ position: [0, 4, 20], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {/* Lighting */}
        <ambientLight color={0x1a0a00} intensity={0.3} />
        <directionalLight
          color={0xff6b35}
          intensity={0.8}
          position={[10, 20, 10]}
        />

        {/* Camera orbit controller */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Background */}
        <BackgroundPlane scrollProgress={scrollProgress} />

        {/* Volcano */}
        <Volcano scrollProgress={scrollProgress} />

        {/* Eruption particles */}
        <EruptionParticles scrollProgress={scrollProgress} />

        {/* Lava flows */}
        <LavaFlows scrollProgress={scrollProgress} />

        {/* Base lava lights */}
        <BaseLavaLights scrollProgress={scrollProgress} />

        {/* Fog for atmosphere */}
        <fog attach="fog" args={[0x080808, 30, 80]} />
      </Canvas>
    </div>
  );
}
