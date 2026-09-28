/**
 * DiscoveryHUD.jsx
 *
 * Heads-Up Display for world telemetry, sector discovery status, and fast actions.
 * Sits unobtrusively on the screen while exploring the 3D world.
 */

import { useWorldState, worldState } from '../experience/WorldState';
import { getRegionById, REGION_LIST } from '../experience/world/worldConfig';

const DiscoveryHUD = ({ onOpenMap }) => {
  const { currentLocation, discoveredLocations, isTransitioning, explorationMode } = useWorldState();
  const currentRegion = getRegionById(currentLocation);

  if (explorationMode === 'INSPECTING') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-8">
      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        {/* Active Sector Telemetry */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-indigo-400 font-semibold">
              SECTOR TELEMETRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
            {currentRegion.label}
          </h1>
          <p className="text-xs text-neutral-400 tracking-wide mt-0.5 max-w-sm hidden sm:block">
            {currentRegion.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Inspect Sector Action Button */}
          <button
            onClick={() => worldState.inspectSector(currentLocation)}
            className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>INSPECT SECTOR</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* World Map Toggle */}
          <button
            onClick={onOpenMap}
            className="px-3.5 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="hidden sm:inline">WORLD MAP</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────── */}
      <div className="flex justify-between items-end">
        {/* Discovery Counter */}
        <div className="pointer-events-auto bg-neutral-950/70 border border-neutral-800/80 rounded-xl px-4 py-2.5 backdrop-blur-md">
          <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase block">
            REGIONAL RECONNAISSANCE
          </span>
          <span className="text-xs font-bold text-neutral-300">
            {discoveredLocations.length} / {REGION_LIST.length} SECTORS MAPPED
          </span>
        </div>

        {/* Travel Indicator */}
        {isTransitioning && (
          <div className="pointer-events-auto bg-indigo-950/80 border border-indigo-500/50 rounded-full px-4 py-1.5 text-xs text-indigo-200 tracking-widest uppercase flex items-center gap-2 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            TRANSIT IN PROGRESS...
          </div>
        )}

        {/* Interaction Hint */}
        <div className="hidden md:block text-right text-[10px] tracking-widest text-neutral-500 uppercase">
          DRAG TO ROTATE WORLD // CLICK BEACONS TO TRAVEL
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHUD;
