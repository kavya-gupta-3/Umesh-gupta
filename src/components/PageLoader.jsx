import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader({ progress, onComplete }) {
  const loaderRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  const barFillRef = useRef();
  const hasAnimatedOut = useRef(false);

  useEffect(() => {
    if (barFillRef.current) {
      barFillRef.current.style.width = `${progress}%`;
    }

    if (progress >= 100 && !hasAnimatedOut.current) {
      hasAnimatedOut.current = true;
      setTimeout(() => animateOut(), 600);
    }
  }, [progress]);

  const animateOut = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    tl.to(leftRef.current, {
      x: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
    }, 0)
    .to(rightRef.current, {
      x: '100%',
      duration: 0.8,
      ease: 'power3.inOut',
    }, 0)
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.3,
    }, 0.7);
  };

  return (
    <div className="page-loader" ref={loaderRef}>
      <div className="page-loader-left" ref={leftRef} />
      <div className="page-loader-right" ref={rightRef} />

      <div className="loader-content">
        <div className="loader-logo">
          <img src="/umesh-logo.png" alt="Umesh Gupta" />
        </div>

        <div className="loader-bar">
          <div className="loader-bar-fill" ref={barFillRef} />
        </div>

        <div className="loader-text">
          Loading Experience... {progress}%
        </div>
      </div>
    </div>
  );
}
