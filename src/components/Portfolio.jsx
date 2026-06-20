import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = {
  Shopify: [
    { name: 'neurometrx.myshopify.com', url: 'https://neurometrx.myshopify.com/' },
    { name: 'wholisticpetorganicscom.myshopify.com', url: 'https://wholisticpetorganicscom.myshopify.com/' },
    { name: 'patchespar3.myshopify.com', url: 'https://patchespar3.myshopify.com/' },
    { name: 'cocoathrill.myshopify.com', url: 'https://cocoathrill.myshopify.com/' },
    { name: 'candmhorseshoessales.myshopify.com', url: 'https://candmhorseshoessales.myshopify.com/' },
  ],
  WordPress: [
    { name: 'jdsofttech.com', url: 'http://www.jdsofttech.com/' },
    { name: 'pixielit.com', url: 'http://www.pixielit.com/' },
    { name: 'sarvajal.com', url: 'http://www.sarvajal.com/' },
    { name: 'coastalcarepharmacy.ca', url: 'http://coastalcarepharmacy.ca/home.html' },
    { name: 'leaft.la', url: 'http://leaft.la/' },
    { name: 'grandgopherboards.com', url: 'http://grandgopherboards.com/' },
    { name: 'hvacclasses.org', url: 'http://www.hvacclasses.org/' },
    { name: 'abuvmedia.com', url: 'http://www.abuvmedia.com/' },
    { name: 'bestofcollegesonline.com', url: 'http://www.bestofcollegesonline.com/' },
  ],
  Corporate: [
    { name: 'greatdayimprovements.com', url: 'https://www.greatdayimprovements.com/' },
    { name: 'thisoldhouse.com', url: 'https://www.thisoldhouse.com/' },
    { name: 'shockerhitch.com', url: 'https://shockerhitch.com/' },
    { name: 'foil-pans.com', url: 'https://www.foil-pans.com/' },
    { name: 'pactogo.com', url: 'https://www.pactogo.com/' },
  ],
};

const tabs = ['Shopify', 'WordPress', 'Corporate'];

export default function Portfolio() {
  const sectionRef = useRef();
  const eyebrowRef = useRef();
  const headingRef = useRef();
  const gridRef = useRef();
  const [activeTab, setActiveTab] = useState('Shopify');

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.project-card');
      gsap.fromTo(cards, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
      });
    }
  }, [activeTab]);

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.project-card');
      gsap.to(cards, {
        opacity: 0, y: 20, duration: 0.2, stagger: 0.03,
        onComplete: () => setActiveTab(tab),
      });
    } else {
      setActiveTab(tab);
    }
  };

  // 3D tilt and spotlight on hover
  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }, []);

  const handleMouseLeave = useCallback((e) => {
    const card = e.currentTarget;
    card.style.transform = '';
  }, []);

  return (
    <section className="section" ref={sectionRef} id="portfolio">
      <div className="section-inner">
        <div ref={eyebrowRef} className="eyebrow">04 — Selected Output</div>
        <h2 ref={headingRef} className="section-heading">Built By Me.</h2>

        <div className="portfolio-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`portfolio-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabSwitch(tab)}
              id={`tab-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="portfolio-grid" ref={gridRef}>
          {projects[activeTab].map((project) => (
            <div
              className="glass-card project-card"
              key={project.name}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`project-badge ${activeTab.toLowerCase()}`}>
                {activeTab}
              </span>
              <div className="project-name">{project.name}</div>
              <a
                href={project.url}
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
