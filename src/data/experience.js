/**
 * Experience / Personal Data
 *
 * Centralised personal and professional information.
 * Will be used in future tasks for:
 *   - Cinematic "story" and "journey" scenes
 *   - Timeline 3D visualizations
 *   - About section enhancements
 *
 * Keep this file as the single source of truth for personal data.
 */

export const PERSONAL = {
  name: 'Gautam Gupta',
  title: 'Software Engineer',
  tagline: 'B.Tech in Information Technology Student',
  bio: 'Passionate about building high-performance web applications and working with technologies like OCR and OpenCV.',
  email: 'gautamguptaworkin@gmail.com',
  github: 'https://github.com/imgautamgupta',
  linkedin: 'https://www.linkedin.com/in/gautam-gupta-620559285',
  location: 'India',
};

/**
 * Roles for the typewriter animation on the Hero.
 * Extracted here so the cinematic intro can also use this data.
 */
export const HERO_ROLES = [
  'Web Developer',
  'Python Developer',
  'OCR Specialist',
  'AI Enthusiast',
];

/**
 * Education timeline entries.
 * Will power a future 3D journey/timeline scene.
 */
export const EDUCATION = [
  {
    id: 'btech',
    institution: 'B.Tech – Information Technology',
    degree: 'Bachelor of Technology',
    field: 'Information Technology',
    startYear: 2022,
    endYear: 2026,
    current: true,
    description: 'Focused on software engineering, machine learning, and web development.',
  },
];

/**
 * About section quick facts.
 * Extracted from About.jsx for reuse in scenes.
 */
export const ABOUT_FACTS = [
  { label: 'Projects Completed', value: '10+', icon: '🚀' },
  { label: 'Technologies Used', value: '15+', icon: '⚡' },
  { label: 'GitHub Contributions', value: '500+', icon: '📦' },
  { label: 'Problem-Solving Skills', value: '100%', icon: '🧠' },
];
