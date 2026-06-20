import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef();
  const eyebrowRef = useRef();
  const headingRef = useRef();
  const itemsRef = useRef([]);

  const jobs = [
    {
      company: 'Multidots',
      url: 'https://www.multidots.com/',
      role: 'Senior Front-End Developer',
      period: 'Jan 2021 — 2026',
      bullets: [
        'Lead front-end development across 15+ client projects simultaneously',
        'Built responsive, accessible interfaces using HTML5, CSS3, Tailwind, jQuery, Bootstrap, SASS — reduced avg page load time by ~35%',
        'Developed and customised Shopify and WordPress themes from scratch',
        'Collaborated cross-functionally in Agile sprints, improving team delivery speed by 20%',
        'Mentored junior developers on best practices, code reviews, and component architecture',
      ],
    },
    {
      company: 'Sibyll Software',
      url: 'http://www.sibyllsoftware.com/',
      role: 'Front-End Developer',
      period: '2018 — 2020',
      bullets: [
        'Designed and developed 20+ HTML5/CSS3 web applications',
        'Translated wireframes and UI/UX mockups into clean, maintainable code — zero-defect delivery on 90% of projects',
        'Installed, configured, and custom-coded Shopify themes',
        'Performed cross-browser testing and performance optimisation',
      ],
    },
    {
      company: 'JD Softtech',
      url: 'http://www.jdsofttech.com/',
      role: 'Front-End Developer',
      period: '2016 — 2018',
      bullets: [
        'Developed responsive HTML5/CSS3 layouts and jQuery-powered interactive components',
        'Collaborated with WordPress backend developers',
        'Reduced CSS/JS bundle sizes by 25% through refactoring and minification',
      ],
    },
    {
      company: 'PixieLit Studios',
      url: 'http://www.pixielit.com/',
      role: 'Junior Front-End Developer',
      period: '2014 — 2016',
      bullets: [
        'Built HTML5, CSS3, and jQuery interfaces under senior guidance',
        'Ensured technical feasibility of UI/UX designs',
        'Delivered 10+ websites for small businesses',
      ],
    },
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

      itemsRef.current.forEach((item, i) => {
        if (item) {
          const isOdd = i % 2 === 0;
          gsap.from(item, {
            x: isOdd ? -60 : 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={sectionRef} id="experience">
      <div className="section-inner">
        <div ref={eyebrowRef} className="eyebrow">03 — Trajectory</div>
        <h2 ref={headingRef} className="section-heading">Where I've Shipped.</h2>

        <div className="timeline">
          {jobs.map((job, i) => (
            <div
              className="timeline-item"
              key={job.company}
              ref={(el) => { itemsRef.current[i] = el; }}
            >
              <div className="timeline-dot" />
              <div className="glass-card timeline-card">
                <div className="timeline-company">
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    {job.company} ↗
                  </a>
                </div>
                <div className="timeline-role">{job.role}</div>
                <div className="timeline-period">{job.period}</div>
                <ul className="timeline-bullets">
                  {job.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
