/**
 * ExperienceFallback.jsx
 *
 * Graceful 2D fallback when WebGL is unavailable or disabled.
 * Provides complete access to all world sectors, content, and telemetry.
 */

import { useState } from 'react';
import { REGION_LIST } from './world/worldConfig';
import { PROJECTS } from '../data/projects';

const ExperienceFallback = () => {
  const [activeSector, setActiveSector] = useState('hub');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 sm:p-12 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-semibold">
            COMPATIBILITY MODE // 2D EXPEDITION
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          GAUTAM GUPTA
        </h1>
        <p className="text-sm text-neutral-400 mt-2 tracking-wide">
          B.Tech Information Technology &mdash; Software Engineer & ML Researcher
        </p>
      </div>

      {/* Sector Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {REGION_LIST.map((region) => (
          <button
            key={region.id}
            onClick={() => setActiveSector(region.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeSector === region.id
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <span className="text-[9px] tracking-widest uppercase font-semibold block text-neutral-500">
              SECTOR
            </span>
            <span className="text-sm font-bold block mt-1">{region.label}</span>
          </button>
        ))}
      </div>

      {/* Active Sector Content Area */}
      <div className="flex-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8">
        {activeSector === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">PROJECTS SECTOR</h2>
            <div className="grid gap-4">
              {PROJECTS.map((p) => (
                <div key={p.id} className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{p.description}</p>
                  <div className="flex gap-2 mt-3">
                    {p.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSector === 'hub' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">CENTRAL HUB</h2>
            <p className="text-sm text-neutral-300">
              Welcome to the digital world of Gautam Gupta. Select any sector above to inspect technical architectures, research projects, and contact channels.
            </p>
          </div>
        )}

        {activeSector === 'mind' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">THE MIND // ABOUT</h2>
            <p className="text-sm text-neutral-300">
              Pursuing a B.Tech in Information Technology. Specialized in applying Machine Learning, Deep Neural Networks, and Computer Vision to real-world challenges such as document intelligence and automated auditing.
            </p>
          </div>
        )}

        {activeSector === 'lab' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">THE LAB // TECHNICAL ARSENAL</h2>
            <p className="text-sm text-neutral-300">
              Proficient in Python, PyTorch, OpenCV, LayoutLM, Scikit-learn, FastAPI, JavaScript, React, and modern full-stack system architecture.
            </p>
          </div>
        )}

        {activeSector === 'journey' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">THE JOURNEY // TIMELINE</h2>
            <p className="text-sm text-neutral-300">
              Evolution through deep learning research, document analysis pipelines, algorithmic problem solving, and full-stack software development.
            </p>
          </div>
        )}

        {activeSector === 'contact' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">COMMS RELAY // CONTACT</h2>
            <p className="text-sm text-neutral-300">
              Email: <a href="mailto:gautamguptaworkin@gmail.com" className="text-indigo-400 underline">gautamguptaworkin@gmail.com</a>
            </p>
            <p className="text-sm text-neutral-300">
              GitHub: <a href="https://github.com/gautamgupta" className="text-indigo-400 underline">github.com/gautamgupta</a>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 pt-6 mt-8 text-center text-xs text-neutral-500 tracking-widest uppercase">
        DIGITAL WORLD FOUNDATION &mdash; GAUTAM GUPTA 2026
      </div>
    </div>
  );
};

export default ExperienceFallback;
