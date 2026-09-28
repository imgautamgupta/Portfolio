import { useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import ExperienceRoot from './experience/ExperienceRoot';
import About from './components/About';
import Skills from './components/Skills';
import useLenis from './hooks/useLenis';

function App() {
  // introPlaying = true  → iris overlay is visible, scroll must be blocked
  // introPlaying = false → iris wipe finished, normal scrolling resumes
  const [introPlaying, setIntroPlaying] = useState(true);

  // BUG 3 FIX: Block Lenis scroll while the intro is playing.
  // useLenis(false) calls lenis.stop() + lenis.scrollTo(0, {immediate:true}).
  // useLenis(true)  calls lenis.start() once the intro completes.
  useLenis(!introPlaying);

  const handleIntroComplete = () => {
    // BUG 3 FIX: Guarantee the native scroll position is at the top
    // before handing off to Lenis, regardless of any scroll that may have
    // slipped through during the intro (belt-and-suspenders alongside
    // useLenis's own scrollTo call).
    window.scrollTo(0, 0);
    setIntroPlaying(false);
  };

  return (
    <>
      {/*
       * ExperienceRoot renders immediately — its 3D canvas/Hero is visible
       * THROUGH the growing iris hole during the wipe. This is what gets
       * "revealed" as the circle expands. Mounting it early also means
       * Three.js has time to initialise while the title card is showing.
       */}
      <ExperienceRoot />

      {/*
       * Scrollable content that lives below the fixed 3D experience.
       * A 100vh spacer creates the "scroll past the canvas" behaviour.
       */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Spacer to push content past the fixed ExperienceRoot canvas */}
        <div style={{ height: '100vh' }} aria-hidden="true" />
        <div style={{ background: '#000008' }}>
          <About />
          <Skills />
        </div>
      </div>

      {/*
       * CinematicIntro sits on top (z-[95]) and returns null once done,
       * so the overlay disappears cleanly after the iris wipe completes.
       */}
      {introPlaying && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}
    </>
  );
}

export default App;
