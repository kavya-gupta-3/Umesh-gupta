import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef();
  const eyebrowRef = useRef();
  const headingRef = useRef();
  const infoRef = useRef();
  const ctasRef = useRef();
  const langBarsRef = useRef([]);

  const languages = [
    { name: 'Gujarati', value: 100, note: 'Native' },
    { name: 'Hindi', value: 100, note: 'Native / Fluent' },
    { name: 'English', value: 70, note: 'Conversational · Strong technical reading' },
  ];

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

      gsap.from(infoRef.current, {
        x: -60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });

      gsap.from(ctasRef.current, {
        x: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });

      langBarsRef.current.forEach((bar, i) => {
        if (bar) {
          gsap.to(bar, {
            width: `${languages[i].value}%`,
            duration: 1.2, ease: 'power3.out', delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={sectionRef} id="contact">
      <div className="section-inner">
        <div ref={eyebrowRef} className="eyebrow">06 — Contact &amp; Engagement</div>
        <h2 ref={headingRef} className="section-heading">Let's Build Something.</h2>

        <div className="glass-card">
          <div className="contact-grid">
            {/* Left — Contact Info */}
            <div ref={infoRef}>
              <div className="contact-info-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div className="contact-info-text">
                  <a href="tel:+918128556609">+91 812-855-6609</a>
                </div>
              </div>

              <div className="contact-info-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <div className="contact-info-text">
                  <a href="mailto:umeshlgupta1984@gmail.com">umeshlgupta1984@gmail.com</a>
                </div>
              </div>

              <div className="contact-info-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div className="contact-info-text">
                  A-404 Vananta Godrej Garden City, Near Global International School, Jagatpur, Ahmedabad - 382470
                </div>
              </div>

              <div className="availability-note">
                Open to senior front-end roles, freelance Shopify / WordPress builds, and long-term collaborations. Reach out — I usually reply within a day.
              </div>

              {/* Languages */}
              <div className="languages-section">
                <div className="eyebrow" style={{ marginBottom: '20px' }}>05 — Voices</div>
                {languages.map((lang, i) => (
                  <div className="skill-bar-wrapper" key={lang.name}>
                    <div className="skill-bar-header">
                      <span className="skill-bar-name">{lang.name}</span>
                      <span className="skill-bar-percent">{lang.value}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        ref={(el) => { langBarsRef.current[i] = el; }}
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Interactive CTA Cards */}
            <div ref={ctasRef} className="contact-ctas">
              <a href="mailto:umeshlgupta1984@gmail.com" className="contact-cta-card" id="contact-email">
                <div className="cta-icon-wrapper">
                  <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div className="cta-content">
                  <span className="cta-label">Send Email</span>
                  <span className="cta-value">umeshlgupta1984@gmail.com</span>
                </div>
                <div className="cta-arrow">→</div>
              </a>

              <a href="tel:+918128556609" className="contact-cta-card" id="contact-phone">
                <div className="cta-icon-wrapper">
                  <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="cta-content">
                  <span className="cta-label">Call Directly</span>
                  <span className="cta-value">+91 812-855-6609</span>
                </div>
                <div className="cta-arrow">→</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
