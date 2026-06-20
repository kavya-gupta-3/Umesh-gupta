import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef();
  const cardRef = useRef();
  const eyebrowRef = useRef();
  const headingRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });

      gsap.from(headingRef.current, {
        clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });

      gsap.from(cardRef.current, {
        y: 80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '50+', label: 'Major Projects' },
    { number: '4', label: 'Companies' },
    { number: '90%', label: 'Zero-Defect Rate' },
  ];

  return (
    <section className="section" ref={sectionRef} id="about">
      <div className="section-inner">
        <div ref={eyebrowRef} className="eyebrow">01 — Identity</div>
        <h2 ref={headingRef} className="section-heading">Front-End, Sharpened.</h2>

        <div ref={cardRef} className="glass-card about-card">
          <p className="body-text" style={{ marginBottom: '16px' }}>
            Results-driven Senior Front-End Developer with 10+ years of hands-on experience delivering high-performance, pixel-perfect web interfaces across e-commerce, SaaS, and corporate platforms.
          </p>
          <p className="body-text" style={{ marginBottom: '16px' }}>
            Proven expertise in HTML5, CSS3, JavaScript/jQuery, Tailwind CSS, Bootstrap, SASS, Shopify, and WordPress. I consistently manage multiple simultaneous projects, meet tight deadlines, and mentor junior developers to maintain code quality and team velocity.
          </p>
          <p className="body-text">
            Passionate about clean architecture and cross-browser compatibility.
          </p>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
