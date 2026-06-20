import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero({ isLoaded }) {
  const heroRef = useRef();
  const labelRef = useRef();
  const name1Ref = useRef();
  const name2Ref = useRef();
  const taglineRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.from(labelRef.current, {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      })
      .from(name1Ref.current, {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
      }, '-=0.5')
      .from(name2Ref.current, {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
      }, '-=0.6')
      .from(taglineRef.current, {
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
      }, '-=0.4')
      .from(ctaRef.current.children, {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
      }, '-=0.3');
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const scrollTo = (e, selector) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" ref={heroRef} id="hero">
      <div ref={labelRef} className="hero-label">
        Senior Front-End Developer
      </div>

      <h1 ref={name1Ref} className="hero-name">
        Umesh
      </h1>

      <div ref={name2Ref} className="hero-name-stroke">
        Gupta
      </div>

      <p ref={taglineRef} className="hero-tagline">
        10+ Years · 50+ Projects · 4 Companies · Ahmedabad, India
      </p>

      <div ref={ctaRef} className="hero-cta">
        <a href="#portfolio" className="btn btn-filled" onClick={(e) => scrollTo(e, '#portfolio')} id="cta-view-work">
          View My Work
        </a>
        <a href="#contact" className="btn btn-outlined" onClick={(e) => scrollTo(e, '#contact')} id="cta-contact">
          Get In Touch
        </a>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
