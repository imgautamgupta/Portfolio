import { useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Letterbox from './components/Letterbox';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import BackgroundStars from './components/BackgroundStars';
import useLenis from './hooks/useLenis';

function App() {
  // introPlaying = true  → iris overlay is visible, scroll must be blocked
  // introPlaying = false → iris wipe finished, normal scrolling resumes
  const [introPlaying, setIntroPlaying] = useState(true);

  // Block Lenis scroll while the intro is playing.
  // useLenis(false) calls lenis.stop() + lenis.scrollTo(0, {immediate:true}).
  // useLenis(true)  calls lenis.start() once the intro completes.
  useLenis(!introPlaying);

  const handleIntroComplete = () => {
    // Guarantee the native scroll position is at the top before handing
    // off to Lenis, regardless of any scroll that may have slipped through
    // during the intro.
    window.scrollTo(0, 0);
    setIntroPlaying(false);
  };

  return (
    <>
      {/* Persistent cinematic chrome */}
      <Letterbox />
      <CustomCursor />
      <BackgroundStars />

      {/* Navigation */}
      <Navbar />

      {/* Scrollable page content */}
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <BackToTop />

      {/*
       * CinematicIntro sits on top (z-[95]) and returns null once done,
       * so the overlay disappears cleanly after the iris wipe completes.
       * Mounting it last means the Hero is already in the DOM and has begun
       * loading when the iris starts to open — creating a true "reveal".
       */}
      {introPlaying && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}
    </>
  );
}

export default App;
