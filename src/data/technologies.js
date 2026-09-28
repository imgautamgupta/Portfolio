/**
 * Technologies / Skills Data
 *
 * Centralised source of truth for all skill/technology entries.
 * Components import from here instead of defining data inline.
 *
 * Fields:
 *   id          — unique string identifier
 *   name        — display name
 *   category    — 'Language' | 'Frontend' | 'Styling' | 'Technology' | 'Tools'
 *   description — short capability summary
 *   level       — proficiency 0–100 (for progress bars and future 3D visualizations)
 *   icon        — emoji icon (temporary; will eventually be replaced by 3D icons)
 *   color       — Tailwind gradient classes for progress bars
 *   tags        — secondary tags shown as pill badges
 */

export const TECHNOLOGIES = [
  {
    id: 'python',
    name: 'Python',
    category: 'Language',
    description: 'Data Analysis, Automation, Scripting',
    level: 85,
    icon: '🐍',
    color: 'from-yellow-500 to-green-500',
    tags: [],
  },
  {
    id: 'ocr-opencv',
    name: 'OCR & OpenCV',
    category: 'Technology',
    description: 'Tesseract, Document Analysis, Fraud Detection',
    level: 80,
    icon: '👁️',
    color: 'from-blue-500 to-cyan-500',
    tags: [],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Tools',
    description: 'Version Control, Collaboration, CI/CD',
    level: 90,
    icon: '🔧',
    color: 'from-gray-500 to-gray-700',
    tags: [],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Language',
    description: 'ES6+, Async/Await, DOM Manipulation',
    level: 85,
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    tags: [],
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    description: 'Hooks, Redux, Context API, Next.js',
    level: 80,
    icon: '⚛️',
    color: 'from-cyan-400 to-blue-500',
    tags: [],
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'Responsive Design, Animations, UI/UX',
    level: 90,
    icon: '🎨',
    color: 'from-teal-400 to-cyan-400',
    tags: [],
  },
];

/**
 * Secondary skills shown as pill tags.
 * These don't have proficiency levels but are worth displaying.
 */
export const SECONDARY_SKILLS = [
  'Node.js',
  'Express',
  'MongoDB',
  'SQL',
  'REST APIs',
  'Git',
  'VS Code',
  'Figma',
  'Linux',
];

/** All unique technology categories */
export const TECH_CATEGORIES = [
  ...new Set(TECHNOLOGIES.map((t) => t.category)),
];
