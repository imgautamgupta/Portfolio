/**
 * DestinationBeacon.jsx
 *
 * A floating label + subtle indicator that appears above a destination
 * when the spacecraft enters the outer approach zone.
 *
 * Features:
 *   - Distance-based opacity fade (invisible far away, appear on approach)
 *   - No permanent floating labels cluttering the universe
 *   - Renders as Billboard (always faces camera)
 *   - Name + distance readout
 *   - Interactive: click triggers universeState.dock()
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import universeState from './UniverseState';

const _shipPos = new THREE.Vector3();
const _destPos = new THREE.Vector3();

const DestinationBeacon = ({ destination, spacecraftRef }) => {
  const [dist, setDist] = useState(Infinity);
  const frameCount = useRef(0);

  // Update distance every 12 frames
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 12 !== 0) return;
    if (!spacecraftRef.current) return;

    spacecraftRef.current.getWorldPosition(_shipPos);
    _destPos.set(...destination.position);
    setDist(_shipPos.distanceTo(_destPos));
  });

  // Only show when within display range
  const DISPLAY_RANGE = destination.approachDistance * 3.5;
  if (dist > DISPLAY_RANGE) return null;

  // Fade in based on distance
  const opacity = Math.max(0, 1 - (dist / DISPLAY_RANGE));
  const isClose = dist < destination.approachDistance * 1.15;
  const distStr = dist < 1000 ? `${Math.round(dist)} u` : `${(dist / 1000).toFixed(1)} ku`;

  const labelY = destination.radius + 4;

  return (
    <group position={destination.position}>
      <Html
        position={[0, labelY, 0]}
        center
        sprite
        style={{ pointerEvents: isClose ? 'auto' : 'none' }}
      >
        <div
          className="beacon-label"
          style={{ opacity }}
          onClick={() => isClose && universeState.dock(destination)}
          data-close={isClose}
        >
          <div className="beacon-name">{destination.name}</div>
          <div className="beacon-subtitle">{destination.subtitle}</div>
          <div className="beacon-dist">{distStr}</div>
          {isClose && (
            <button className="beacon-enter" onClick={() => universeState.dock(destination)}>
              ENTER
            </button>
          )}
        </div>
      </Html>
    </group>
  );
};

export default DestinationBeacon;
