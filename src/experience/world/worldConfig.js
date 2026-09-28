/**
 * worldConfig.js
 *
 * Topological and spatial definition of the explorable digital world.
 * Defines regions, 3D world coordinates, camera anchors, and interconnected routes.
 *
 * Conceptual Topology:
 *                CENTRAL HUB
 *          /        |        \
 *         /         |         \
 *       MIND      JOURNEY      LAB
 *         \         |          /
 *          \        |         /
 *              PROJECTS
 *                  |
 *               CONTACT
 */

export const REGIONS = {
  hub: {
    id: 'hub',
    label: 'CENTRAL HUB',
    shortLabel: 'Hub',
    subtitle: 'Coordinate 0.0.0 // Spatial Nexus',
    position: [0, 0, 0],
    cameraOffset: [0, 5.5, 13.5],
    cameraLookAt: [0, 0, 0],
    radius: 5.0,
    color: '#818cf8', // Indigo starlight
    summary:
      'The central navigational core of Gautam Gupta’s digital world. From here, pathways extend into Mind, Journey, Lab, Projects, and Contact.',
    links: ['mind', 'journey', 'lab', 'projects'],
  },
  mind: {
    id: 'mind',
    label: 'THE MIND',
    shortLabel: 'Mind',
    subtitle: 'Cognitive Blueprint & Philosophy',
    position: [-16, 1.2, -6],
    cameraOffset: [-16, 4.8, 4.0],
    cameraLookAt: [-16, 1.2, -6],
    radius: 4.5,
    color: '#38bdf8', // Sky starlight
    summary:
      'Foundational philosophy, academic background in Information Technology, engineering principles, and core focus areas.',
    links: ['hub', 'journey', 'projects'],
  },
  journey: {
    id: 'journey',
    label: 'THE JOURNEY',
    shortLabel: 'Journey',
    subtitle: 'Timeline, Evolution & Milestones',
    position: [0, 2.0, -20],
    cameraOffset: [0, 6.0, -10.0],
    cameraLookAt: [0, 2.0, -20],
    radius: 4.5,
    color: '#c084fc', // Purple starlight
    summary:
      'Evolution from foundational programming to complex machine learning pipelines, document intelligence, and full-stack systems.',
    links: ['hub', 'mind', 'lab'],
  },
  lab: {
    id: 'lab',
    label: 'THE LAB',
    shortLabel: 'Lab',
    subtitle: 'Technical Arsenal & Experiments',
    position: [16, 1.2, -6],
    cameraOffset: [16, 4.8, 4.0],
    cameraLookAt: [16, 1.2, -6],
    radius: 4.5,
    color: '#34d399', // Emerald starlight
    summary:
      'Technical capabilities across Python, PyTorch, OpenCV, OCR engines, FastAPI, React, and modern system architectures.',
    links: ['hub', 'journey', 'projects'],
  },
  projects: {
    id: 'projects',
    label: 'PROJECTS SECTOR',
    shortLabel: 'Projects',
    subtitle: 'Loan Fraud, CodeGuard, NeuroNest, ABHI-MOH',
    position: [0, 0.5, 16],
    cameraOffset: [0, 5.8, 26.5],
    cameraLookAt: [0, 0.5, 16],
    radius: 6.0,
    color: '#fbbf24', // Amber starlight
    summary:
      'Engineered applications: Loan Fraud Detection, CodeGuard AI Review, NeuroNest, ABHI-MOH, and open-source systems.',
    links: ['hub', 'mind', 'lab', 'contact'],
  },
  contact: {
    id: 'contact',
    label: 'COMMS RELAY',
    shortLabel: 'Contact',
    subtitle: 'Direct Frequency & Signals',
    position: [0, 0.8, 32],
    cameraOffset: [0, 5.0, 42.0],
    cameraLookAt: [0, 0.8, 32],
    radius: 4.0,
    color: '#f472b6', // Rose starlight
    summary:
      'Direct transmission channel for opportunities, collaborative engineering projects, and research inquiries.',
    links: ['projects'],
  },
};

/** List of region descriptors */
export const REGION_LIST = Object.values(REGIONS);

/** Quick lookup helper */
export const getRegionById = (id) => REGIONS[id] || REGIONS.hub;

/** Topological pathways connecting regions for visual constellation rendering */
export const WORLD_PATHWAYS = [
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
