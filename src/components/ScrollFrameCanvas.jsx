import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 300;

// Generate frame paths
function getFramePath(index) {
  const num = String(index).padStart(3, '0');
  return `/volcano-frames/${num}.jpg`;
}

export default function ScrollFrameCanvas({ onProgress, onPreloadComplete }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef({ value: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw current frame on resize
      drawFrame(Math.round(currentFrameRef.current.value));
    };

    window.addEventListener('resize', resize);
    resize();

    // Load all 300 frames
    let loadedCount = 0;
    const images = new Array(TOTAL_FRAMES);
    const criticalTarget = 60; // We want to load 60 frames for the loader to clear

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i + 1);
      img.onload = () => {
        loadedCount++;
        images[i] = img;

        // Calculate progress based on the critical target (0 to 100)
        const criticalProgress = Math.min(100, Math.floor((loadedCount / criticalTarget) * 100));
        if (onProgress) {
          onProgress(criticalProgress);
        }

        // Draw first frame immediately
        if (i === 0 && canvas) {
          drawFrame(0);
        }

        // Signal preload complete when the critical target is hit
        if (loadedCount === criticalTarget && onPreloadComplete) {
          onPreloadComplete();
        }
      };
      img.onerror = () => {
        loadedCount++;
        const criticalProgress = Math.min(100, Math.floor((loadedCount / criticalTarget) * 100));
        if (onProgress) {
          onProgress(criticalProgress);
        }
        if (loadedCount === criticalTarget && onPreloadComplete) {
          onPreloadComplete();
        }
      };
    }

    imagesRef.current = images;

    // Draw a frame to the canvas
    function drawFrame(frameIndex) {
      const img = imagesRef.current[frameIndex];
      if (!img || !ctx) return;

      // Cover-fit the image to canvas
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    }

    // GSAP ScrollTrigger: map scroll → frame index
    const scrollTrigger = gsap.to(currentFrameRef.current, {
      value: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: () => {
          const frame = Math.round(currentFrameRef.current.value);
          drawFrame(frame);
        },
      },
    });

    return () => {
      window.removeEventListener('resize', resize);
      scrollTrigger.scrollTrigger?.kill();
      scrollTrigger.kill();
    };
  }, [onProgress, onPreloadComplete]);

  return (
    <div className="frame-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
