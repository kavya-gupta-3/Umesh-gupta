import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PageLoader from './components/PageLoader';
import ScrollFrameCanvas from './components/ScrollFrameCanvas';
import EmberParticles from './components/EmberParticles';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Refresh ScrollTrigger after fonts load
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaded(true);
    // Re-trigger ScrollTrigger refresh after loader is done
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      {/* Page Loader */}
      {!loaded && <PageLoader progress={loadProgress} onComplete={handleLoaderComplete} />}

      {/* Background Scroll Animation */}
      <ScrollFrameCanvas onProgress={setLoadProgress} onPreloadComplete={handleLoaderComplete} />

      {/* Floating Ember Particles */}
      <EmberParticles />

      {/* Overlays */}
      <div className="vignette-overlay" />
      <div className="atmospheric-haze" />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content — 600vh scroll container */}
      <div className="scroll-container">
        <Hero isLoaded={loaded} />

        <About />

        <Skills />

        <Experience />

        <Portfolio />

        <Contact />

        <Footer />
      </div>
    </>
  );
}
