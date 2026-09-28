/**
 * WorldControls.jsx
 *
 * Keyboard shortcut listener and interaction binding for the explorable world.
 *
 * Shortcuts:
 *   - 'M': Toggle World Map
 *   - 'Escape': Exit Sector Inspector or Close Map
 *   - '1' - '6': Direct Sector Jumps
 *   - 'Space': Inspect Current Sector
 */

import { useEffect } from 'react';
import { worldState, useWorldState } from '../experience/WorldState';
import { REGION_LIST } from '../experience/world/worldConfig';

const WorldControls = ({ onToggleMap }) => {
  const { currentLocation, explorationMode } = useWorldState();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore key events when typing inside inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleMap();
      } else if (e.key === 'Escape') {
        if (explorationMode === 'INSPECTING') {
          worldState.closeSector();
        } else if (explorationMode === 'MAP') {
          worldState.setMode('FREE');
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (explorationMode === 'FREE') {
          e.preventDefault();
          worldState.inspectSector(currentLocation);
        }
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (REGION_LIST[index]) {
          worldState.travelTo(REGION_LIST[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLocation, explorationMode, onToggleMap]);

  return null;
};

export default WorldControls;
