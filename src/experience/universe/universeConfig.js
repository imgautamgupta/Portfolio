/**
 * universeConfig.js
 *
 * The source-of-truth data model for every destination in Gautam Gupta's digital universe.
 *
 * Each destination is a location in 3D space that the spacecraft can travel to.
 * Positions are in world-space units. The spacecraft begins near the origin (0,0,0).
 *
 * Destination fields:
 *   id             — unique identifier, used in WorldState and routing
 *   name           — display name (revealed on approach)
 *   subtitle       — secondary identity line
 *   type           — 'star' | 'planet' | 'cluster'
 *   position       — [x, y, z] world coordinates
 *   radius         — visual radius for the celestial body
 *   color          — primary light/material color
 *   atmosphereColor— rim/atmosphere tint
 *   emissive       — emissive color (self-lit bodies)
 *   emissiveIntensity — how strongly self-lit
 *   roughness      — PBR surface roughness
 *   metalness      — PBR metalness
 *   approachDistance — how close spacecraft needs to be to trigger "arrival"
 *   discoverable   — whether it shows up as a target before visiting
 *   unlocked       — whether the visitor can approach on first visit
 *   content        — structured content for the destination panel
 *   scene          — future: id of a 3D scene to transition into
 *   visualParams   — additional per-destination visual parameters
 */

export const DESTINATIONS = {
  home: {
    id: 'home',
    name: 'ORIGIN STAR',
    subtitle: 'Coordinate 0,0,0 — The Core',
    type: 'star',
    position: [0, 0, -320],
    radius: 38,
    color: '#f8e8c0',
    atmosphereColor: '#ffaa40',
    emissive: '#ff9020',
    emissiveIntensity: 1.4,
    roughness: 0.9,
    metalness: 0.0,
    approachDistance: 95,
    discoverable: true,
    unlocked: true,
    scene: null,
    content: {
      title: 'GAUTAM GUPTA',
      body: 'Software Engineer and ML Researcher. The origin of this digital universe.',
    },
    visualParams: {
      coronaRadius: 58,
      coronaOpacity: 0.12,
      rotationSpeed: 0.008,
      pulseAmplitude: 0.04,
    },
  },

  mind: {
    id: 'mind',
    name: 'MIND',
    subtitle: 'Identity & Engineering Philosophy',
    type: 'planet',
    position: [-420, 40, -200],
    radius: 22,
    color: '#4a8fcc',
    atmosphereColor: '#3a6fa8',
    emissive: '#1a4060',
    emissiveIntensity: 0.45,
    roughness: 0.7,
    metalness: 0.15,
    approachDistance: 55,
    discoverable: true,
    unlocked: true,
    scene: null,
    content: {
      title: 'THE MIND',
      body: 'B.Tech in Information Technology. Specialized in applying Machine Learning, Computer Vision, and automated intelligence to real-world challenges.',
    },
    visualParams: {
      atmosphereThickness: 1.08,
      cloudOpacity: 0.18,
      rotationSpeed: 0.004,
    },
  },

  journey: {
    id: 'journey',
    name: 'JOURNEY',
    subtitle: 'Timeline of Growth & Milestones',
    type: 'planet',
    position: [60, -80, -510],
    radius: 18,
    color: '#8b68c8',
    atmosphereColor: '#6a4aaa',
    emissive: '#3a1a6a',
    emissiveIntensity: 0.40,
    roughness: 0.6,
    metalness: 0.1,
    approachDistance: 50,
    discoverable: true,
    unlocked: true,
    scene: null,
    content: {
      title: 'THE JOURNEY',
      body: 'Evolution from foundational programming to ML pipelines, document intelligence, automated code review, and full-stack systems engineering.',
    },
    visualParams: {
      atmosphereThickness: 1.06,
      rotationSpeed: 0.006,
      ringRadius: 30,
      ringOpacity: 0.22,
    },
  },

  lab: {
    id: 'lab',
    name: 'THE LAB',
    subtitle: 'Technical Arsenal & Research',
    type: 'planet',
    position: [480, 20, -280],
    radius: 20,
    color: '#38a86c',
    atmosphereColor: '#2a8050',
    emissive: '#0a4020',
    emissiveIntensity: 0.42,
    roughness: 0.5,
    metalness: 0.25,
    approachDistance: 52,
    discoverable: true,
    unlocked: true,
    scene: null,
    content: {
      title: 'THE LAB',
      body: 'Python · PyTorch · OpenCV · LayoutLM · XGBoost · FastAPI · React · Node.js · REST APIs · Static Analysis.',
    },
    visualParams: {
      atmosphereThickness: 1.05,
      rotationSpeed: 0.009,
    },
  },

  'loan-fraud': {
    id: 'loan-fraud',
    name: 'LOAN FRAUD',
    subtitle: 'Document Intelligence & ML Detection',
    type: 'planet',
    position: [-280, -120, -680],
    radius: 15,
    color: '#d4820a',
    atmosphereColor: '#a06010',
    emissive: '#503000',
    emissiveIntensity: 0.12,
    roughness: 0.55,
    metalness: 0.3,
    approachDistance: 45,
    discoverable: true,
    unlocked: true,
    scene: 'loan-fraud',
    content: {
      title: 'LOAN FRAUD DETECTION',
      body: 'Multi-stage pipeline: Document ingestion → LayoutLM OCR → Feature extraction → XGBoost + PyTorch Autoencoder anomaly detection.',
      tags: ['Python', 'XGBoost', 'PyTorch', 'TesseractOCR', 'OpenCV', 'Machine Learning'],
      github: 'https://github.com/gautamgupta',
      status: 'complete',
    },
    visualParams: {
      atmosphereThickness: 1.04,
      rotationSpeed: 0.007,
    },
  },

  codeguard: {
    id: 'codeguard',
    name: 'CODEGUARD',
    subtitle: 'AI-Driven Code Analysis',
    type: 'planet',
    position: [340, 60, -750],
    radius: 14,
    color: '#c84050',
    atmosphereColor: '#a02030',
    emissive: '#500010',
    emissiveIntensity: 0.1,
    roughness: 0.45,
    metalness: 0.4,
    approachDistance: 44,
    discoverable: true,
    unlocked: true,
    scene: 'codeguard',
    content: {
      title: 'CODEGUARD',
      body: 'Automated code review platform. Python · FastAPI · Pylint · Flake8 · Bandit for security and vulnerability analysis.',
      tags: ['Python', 'FastAPI', 'JavaScript', 'Security', 'Automation'],
      github: 'https://github.com/gautamgupta',
      status: 'complete',
    },
    visualParams: {
      atmosphereThickness: 1.03,
      rotationSpeed: 0.011,
    },
  },

  neuronest: {
    id: 'neuronest',
    name: 'NEURONEST',
    subtitle: 'Neural Architecture Research',
    type: 'planet',
    position: [-180, 160, -900],
    radius: 12,
    color: '#7060e8',
    atmosphereColor: '#5040b0',
    emissive: '#201060',
    emissiveIntensity: 0.2,
    roughness: 0.4,
    metalness: 0.5,
    approachDistance: 40,
    discoverable: true,
    unlocked: true,
    scene: 'neuronest',
    content: {
      title: 'NEURONEST',
      body: 'Deep learning and neural computing research. Technical specifications currently being assembled.',
      tags: ['Neural Networks', 'PyTorch', 'Deep Learning'],
      status: 'requires-content',
    },
    visualParams: {
      atmosphereThickness: 1.06,
      rotationSpeed: 0.005,
    },
  },

  'abhi-moh': {
    id: 'abhi-moh',
    name: 'ABHI-MOH',
    subtitle: 'Systems Engineering Initiative',
    type: 'planet',
    position: [580, -60, -1050],
    radius: 13,
    color: '#c8a040',
    atmosphereColor: '#a07830',
    emissive: '#503010',
    emissiveIntensity: 0.1,
    roughness: 0.65,
    metalness: 0.2,
    approachDistance: 42,
    discoverable: true,
    unlocked: true,
    scene: 'abhi-moh',
    content: {
      title: 'ABHI-MOH',
      body: 'Specialized systems engineering project. Architecture documentation currently being prepared.',
      tags: ['Systems', 'Python', 'Architecture'],
      status: 'requires-content',
    },
    visualParams: {
      atmosphereThickness: 1.04,
      rotationSpeed: 0.008,
    },
  },

  'more-projects': {
    id: 'more-projects',
    name: 'ARCHIVE',
    subtitle: 'Research Experiments & Open Source',
    type: 'cluster',
    position: [-500, 120, -1200],
    radius: 10,
    color: '#607880',
    atmosphereColor: '#405060',
    emissive: '#102030',
    emissiveIntensity: 0.08,
    roughness: 0.8,
    metalness: 0.1,
    approachDistance: 38,
    discoverable: true,
    unlocked: true,
    scene: null,
    content: {
      title: 'OPEN SOURCE ARCHIVE',
      body: 'Collection of experimental algorithms, computer vision utilities, and exploratory repositories.',
      github: 'https://github.com/gautamgupta',
    },
    visualParams: {
      rotationSpeed: 0.003,
    },
  },
};

/** Ordered list of all destinations */
export const DESTINATION_LIST = Object.values(DESTINATIONS);

/** Quick lookup */
export const getDestinationById = (id) => DESTINATIONS[id] ?? null;

/** Home/origin reference */
export const HOME_DESTINATION = DESTINATIONS.home;

/**
 * Spacecraft starting position — slightly in front of origin,
 * looking toward the home star.
 */
export const SPACECRAFT_START = {
  position: [0, 0, 80],
  rotation: [0, Math.PI, 0], // facing toward -Z (toward home star)
};
