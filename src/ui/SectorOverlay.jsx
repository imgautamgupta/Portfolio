/**
 * SectorOverlay.jsx
 *
 * Dedicated UI panel that presents sector content when inspecting:
 *   - PROJECTS SECTOR (Loan Fraud, CodeGuard, NeuroNest, ABHI-MOH, More Projects)
 *   - THE MIND (Philosophy, background, IT degree)
 *   - THE LAB (Skills, tech stack, OCR/AI architecture)
 *   - THE JOURNEY (Timeline & milestones)
 *   - COMMS RELAY (Direct contact & social channels)
 *   - CENTRAL HUB (Spatial directory)
 *
 * Architectural separation:
 *   Clean decoupled UI that overlays the 3D world without destroying it.
 */

import { useWorldState, worldState } from '../experience/WorldState';
import { getRegionById } from '../experience/world/worldConfig';
import { PROJECTS } from '../data/projects';

const SectorOverlay = () => {
  const { activeSector, explorationMode } = useWorldState();

  if (explorationMode !== 'INSPECTING' || !activeSector) return null;

  const region = getRegionById(activeSector);

  const handleClose = () => {
    worldState.closeSector();
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-neutral-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl h-full bg-neutral-900/95 border-l border-neutral-800 shadow-2xl flex flex-col overflow-y-auto text-neutral-200 p-6 sm:p-10">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-neutral-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: region.color }}
              ></span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-semibold">
                SECTOR INSPECTION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {region.label}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">{region.subtitle}</p>
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full border border-neutral-700 hover:border-white text-xs text-neutral-300 hover:text-white uppercase tracking-widest transition-colors"
          >
            [ESC // EXIT]
          </button>
        </div>

        {/* Sector Content Router */}
        <div className="flex-1 space-y-6">
          {/* ── PROJECTS SECTOR ─────────────────────────────────────── */}
          {activeSector === 'projects' && (
            <div className="space-y-6">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Production-grade applications and intelligent systems engineered by Gautam Gupta.
              </p>

              <div className="grid gap-4">
                {PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => worldState.visitProject(project.id)}
                    className="p-5 bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-600 rounded-2xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-white">
                        {project.title}
                      </h3>
                      {project.status === 'requires-content' ? (
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-full uppercase tracking-wider">
                          Curating Specs
                        </span>
                      ) : project.featured ? (
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] bg-neutral-800/70 text-neutral-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.status !== 'requires-content' && (
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        {project.github && project.github !== '#' && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white transition-colors"
                          >
                            GitHub Repository &rarr;
                          </a>
                        )}
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Live System &rarr;
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── THE MIND ────────────────────────────────────────────── */}
          {activeSector === 'mind' && (
            <div className="space-y-6">
              <div className="p-5 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl">
                <h3 className="text-sm font-bold text-indigo-400 tracking-wider uppercase mb-2">
                  Cognitive Blueprint
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                  B.Tech in Information Technology student passionate about engineering high-performance software systems, computer vision pipelines, and scalable backend services.
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Focusing on the convergence of machine learning, automated intelligence, and modern user-centric interfaces.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-neutral-950/40 border border-neutral-800 rounded-xl">
                  <span className="text-2xl font-black text-white block">IT</span>
                  <span className="text-[10px] uppercase text-neutral-500 tracking-widest">
                    B.Tech Degree
                  </span>
                </div>
                <div className="p-4 bg-neutral-950/40 border border-neutral-800 rounded-xl">
                  <span className="text-2xl font-black text-white block">AI / CV</span>
                  <span className="text-[10px] uppercase text-neutral-500 tracking-widest">
                    Core Specialization
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── THE LAB ─────────────────────────────────────────────── */}
          {activeSector === 'lab' && (
            <div className="space-y-6">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Core technologies, framework proficiencies, and architectural engines utilized across systems:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Machine Learning & Vision
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Python, PyTorch, OpenCV, Scikit-learn, LayoutLM, TesseractOCR, EasyOCR, XGBoost
                  </p>
                </div>
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Backend & Systems
                  </h4>
                  <p className="text-xs text-neutral-400">
                    FastAPI, Node.js, REST APIs, Static Analysis (Pylint, Flake8, Bandit)
                  </p>
                </div>
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Frontend & 3D Experiences
                  </h4>
                  <p className="text-xs text-neutral-400">
                    React 19, JavaScript, Three.js, React Three Fiber, GSAP, Tailwind CSS
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── THE JOURNEY ─────────────────────────────────────────── */}
          {activeSector === 'journey' && (
            <div className="space-y-6">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Key progression and technological evolution over recent milestones:
              </p>

              <div className="relative border-l border-neutral-800 pl-6 space-y-6 ml-2">
                <div>
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold block">
                    2024 &mdash; PRESENT
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Machine Learning & Document Intelligence
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Developed Loan Fraud Detection with OCR and deep autoencoders; created CodeGuard automated analysis platform.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold block">
                    ACADEMIC FOUNDATION
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    B.Tech in Information Technology
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Rigorous study of Data Structures, Algorithms, Computer Networks, and System Architecture.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── COMMS RELAY ─────────────────────────────────────────── */}
          {activeSector === 'contact' && (
            <div className="space-y-6">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Direct channels to initiate contact for software roles, machine learning research, or collaborative projects.
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:gautamguptaworkin@gmail.com"
                  className="block p-4 bg-neutral-950/60 border border-neutral-800 hover:border-indigo-500 rounded-xl transition-colors"
                >
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">
                    DIRECT TRANSMISSION // EMAIL
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    gautamguptaworkin@gmail.com
                  </span>
                </a>

                <a
                  href="https://www.linkedin.com/in/gautam-gupta-620559285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-neutral-950/60 border border-neutral-800 hover:border-indigo-500 rounded-xl transition-colors"
                >
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">
                    PROFESSIONAL NETWORK // LINKEDIN
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    linkedin.com/in/gautam-gupta-620559285
                  </span>
                </a>

                <a
                  href="https://github.com/gautamgupta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-neutral-950/60 border border-neutral-800 hover:border-indigo-500 rounded-xl transition-colors"
                >
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">
                    CODE REPOSITORY // GITHUB
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    github.com/gautamgupta
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* ── CENTRAL HUB ─────────────────────────────────────────── */}
          {activeSector === 'hub' && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                You are at the Central Hub coordinate 0.0.0. Use the world map or spatial beacons to explore the sectors of this digital environment.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['mind', 'journey', 'lab', 'projects', 'contact'].map((secId) => {
                  const sec = getRegionById(secId);
                  return (
                    <button
                      key={secId}
                      onClick={() => worldState.travelTo(secId)}
                      className="p-3 bg-neutral-950/40 border border-neutral-800 hover:border-indigo-500 rounded-xl text-left transition-colors"
                    >
                      <span className="text-[9px] tracking-widest uppercase text-neutral-500 block">
                        FAST TRAVEL
                      </span>
                      <span className="text-xs font-bold text-white mt-0.5 block">
                        {sec.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorOverlay;
