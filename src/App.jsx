import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import BackgroundStars from './components/BackgroundStars';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <div className={`min-h-screen text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden ${loading ? 'overflow-hidden h-screen' : ''}`}>
        <BackgroundStars />
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <BackToTop />
      </div>
    </>
  );
}

export default App;
