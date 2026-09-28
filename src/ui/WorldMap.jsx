/**
 * WorldMap.jsx
 *
 * Topological HUD Minimap & Sector Fast-Travel.
 *
 * Visualises the world layout:
 *                 CENTRAL HUB
 *           /        |        \
 *          /         |         \
 *        MIND      JOURNEY      LAB
 *          \         |          /
 *           \        |         /
 *               PROJECTS
 *                   |
 *                CONTACT
 *
 * Features:
 *   - Visualises player position and discovered vs unexplored sectors.
 *   - Fast-travel on node click.
 *   - Clean editorial HUD aesthetic with compass/radar aesthetics.
 */

import { worldState, useWorldState } from '../experience/WorldState';
import { REGION_LIST } from '../experience/world/worldConfig';

const MAP_POSITIONS = {
  hub:      { x: 50, y: 35 },
  mind:     { x: 22, y: 38 },
  journey:  { x: 50, y: 15 },
  lab:      { x: 78, y: 38 },
  projects: { x: 50, y: 65 },
  contact:  { x: 50, y: 88 },
};

const MAP_LINES = [
  ['hub', 'mind'],
  ['hub', 'journey'],
  ['hub', 'lab'],
  ['hub', 'projects'],
  ['mind', 'journey'],
  ['lab', 'journey'],
  ['mind', 'projects'],
  ['lab', 'projects'],
  ['projects', 'contact'],
];

const WorldMap = ({ isOpen, onClose }) => {
  const { currentLocation, discoveredLocations, isTransitioning } = useWorldState();
  const discoveredSet = new Set(discoveredLocations);

  if (!isOpen) return null;

  const handleNodeClick = (regionId) => {
    worldState.travelTo(regionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-xl bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-neutral-800/80 pb-4 mb-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-indigo-400 font-semibold block">
              TOPOLOGICAL TELEMETRY
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              DIGITAL WORLD MAP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full border border-neutral-700 text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors uppercase tracking-widest"
          >
            [CLOSE ESC]
          </button>
        </div>

        {/* Topological Map Canvas (SVG) */}
        <div className="relative w-full aspect-[4/3] bg-neutral-950/70 border border-neutral-800/60 rounded-2xl overflow-hidden flex items-center justify-center">
          {/* Subtle Radar Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-3/4 h-3/4 rounded-full border border-neutral-500"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full border border-neutral-500"></div>
            <div className="absolute w-1/4 h-1/4 rounded-full border border-neutral-500"></div>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Connecting Pathway Lines */}
            {MAP_LINES.map(([start, end]) => {
              const p1 = MAP_POSITIONS[start];
              const p2 = MAP_POSITIONS[end];
              const isDiscovered = discoveredSet.has(start) && discoveredSet.has(end);
              return (
                <line
                  key={`${start}-${end}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke={isDiscovered ? '#6366f1' : '#334155'}
                  strokeWidth={isDiscovered ? '1.5' : '1'}
                  strokeDasharray={isDiscovered ? 'none' : '3 3'}
                  strokeOpacity={isDiscovered ? '0.6' : '0.3'}
                />
              );
            })}
          </svg>

          {/* Interactive Sector Nodes */}
          {REGION_LIST.map((region) => {
            const pos = MAP_POSITIONS[region.id];
            const isCurrent = currentLocation === region.id;
            const isDiscovered = discoveredSet.has(region.id);

            return (
              <div
                key={region.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handleNodeClick(region.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 ${
                  isTransitioning ? 'pointer-events-none' : ''
                }`}
              >
                {/* Node Beacon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 ring-4 ring-indigo-500/20'
                      : isDiscovered
                      ? 'bg-neutral-800 border border-indigo-400/60 text-indigo-300 hover:border-white'
                      : 'bg-neutral-900 border border-neutral-700/60 text-neutral-600'
                  }`}
                >
                  <span className="text-[9px] font-bold">
                    {region.shortLabel.slice(0, 1)}
                  </span>
                </div>

                {/* Node Label */}
                <span
                  className={`mt-1.5 text-[9px] tracking-widest uppercase font-medium whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-indigo-400 font-bold'
                      : isDiscovered
                      ? 'text-neutral-300 group-hover:text-white'
                      : 'text-neutral-600'
                  }`}
                >
                  {region.shortLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Guidance */}
        <div className="flex justify-between items-center mt-5 text-[11px] text-neutral-500 tracking-wider">
          <span>SELECT ANY NODE TO ENGAGE QUANTUM TRAVEL</span>
          <span className="text-neutral-400">
            DISCOVERED: {discoveredLocations.length} / {REGION_LIST.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
