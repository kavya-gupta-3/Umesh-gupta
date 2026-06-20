import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef();
  const eyebrowRef = useRef();
  const headingRef = useRef();
  const barsRef = useRef([]);
  const cardRef = useRef();

  const skills = [
    { name: 'HTML5', value: 99 },
    { name: 'CSS3', value: 99 },
    { name: 'SASS', value: 95 },
    { name: 'Bootstrap', value: 95 },
    { name: 'JavaScript / jQuery', value: 90 },
    { name: 'Tailwind CSS', value: 90 },
    { name: 'Photoshop', value: 80 },
    { name: 'Illustrator', value: 75 },
    { name: 'Shopify', value: 50 },
    { name: 'WordPress', value: 50 },
  ];

  const toolGroups = [
    { label: 'Front-End Core', tools: ['HTML5', 'CSS3', 'JavaScript ES6+', 'jQuery', 'SASS / SCSS'] },
    { label: 'Frameworks', tools: ['Bootstrap 4/5', 'Tailwind CSS'] },
    { label: 'CMS & E-Commerce', tools: ['Shopify', 'WordPress'] },
    { label: 'Design Tools', tools: ['Photoshop', 'Illustrator', 'Figma'] },
    { label: 'Dev Tools', tools: ['Git', 'VS Code', 'Chrome DevTools'] },
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

      gsap.from(cardRef.current, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });

      barsRef.current.forEach((bar, i) => {
        if (bar) {
          gsap.to(bar, {
            width: `${skills[i].value}%`,
            duration: 1.2,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={sectionRef} id="skills">
      <div className="section-inner">
        <div ref={eyebrowRef} className="eyebrow">02 — Toolkit</div>
        <h2 ref={headingRef} className="section-heading">Built With These.</h2>

        <div ref={cardRef} className="glass-card">
          <div className="skills-grid">
            <div>
              {skills.map((skill, i) => (
                <div className="skill-bar-wrapper" key={skill.name}>
                  <div className="skill-bar-header">
                    <span className="skill-bar-name">{skill.name}</span>
                    <span className="skill-bar-percent">{skill.value}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      ref={(el) => { barsRef.current[i] = el; }}
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              {toolGroups.map((group) => (
                <div className="chip-group" key={group.label}>
                  <div className="chip-group-title">{group.label}</div>
                  <div className="chip-row">
                    {group.tools.map((tool) => (
                      <span className="chip" key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
