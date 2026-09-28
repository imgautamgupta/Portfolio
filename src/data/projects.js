/**
 * Projects Data
 *
 * Centralised source of truth for all portfolio projects.
 *
 * Specific requirements:
 *   1. Loan Fraud Detection
 *   2. CodeGuard
 *   3. NeuroNest (requires content - no invented functionality)
 *   4. ABHI-MOH (requires content - no invented functionality)
 *   5. More Projects
 *   * To-Do List project removed from main lineup.
 */

export const PROJECTS = [
  {
    id: 'loan-fraud',
    title: 'Loan Fraud Detection Via Document',
    shortTitle: 'Loan Fraud Detection',
    description:
      'Built a Loan Fraud Detection system using Python, NumPy, Scikit-learn, XGBoost, and Autoencoders (PyTorch) to identify fraudulent loan patterns. Implemented a document processing pipeline with LayoutLM, TesseractOCR, EasyOCR, OpenCV, and PyMuPDF.',
    longDesc:
      'A multi-stage pipeline designed to process unstructured financial documents, extract dense tabular and textual features via OCR and LayoutLM, and identify anomalous loan applications using autoencoders and gradient boosting.',
    tags: ['Python', 'XGBoost', 'PyTorch', 'OCR', 'OpenCV', 'Machine Learning'],
    category: 'ml',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/imgautamgupta',
    featured: true,
    year: 2024,
    status: 'complete',
  },
  {
    id: 'codeguard',
    title: 'CodeGuard – AI-Driven Code Review',
    shortTitle: 'CodeGuard',
    description:
      'Built an automated code review tool using Python, FastAPI, HTML, CSS, and JavaScript. Integrated Pylint, Flake8, and Bandit to detect bugs and security vulnerabilities. Implemented intelligent analysis with REST APIs and workflow automation.',
    longDesc:
      'Automates security auditing, vulnerability triage, and code style compliance across pull requests and repositories. Utilizes static analysis engines integrated with lightweight REST APIs.',
    tags: ['Python', 'FastAPI', 'JavaScript', 'Security', 'Automation', 'REST API'],
    category: 'fullstack',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/imgautamgupta',
    featured: true,
    year: 2024,
    status: 'complete',
  },
  {
    id: 'neuronest',
    title: 'NeuroNest',
    shortTitle: 'NeuroNest',
    description:
      'Deep learning and neural computing architecture. Detailed benchmarks and project case study are currently being assembled.',
    longDesc: null,
    tags: ['Neural Networks', 'PyTorch', 'Deep Learning', 'Research'],
    category: 'ml',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1470&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/imgautamgupta',
    featured: false,
    year: 2024,
    status: 'requires-content', // Verified: No invented functionality
  },
  {
    id: 'abhi-moh',
    title: 'ABHI-MOH',
    shortTitle: 'ABHI-MOH',
    description:
      'Specialized software engineering initiative. Repository documentation and technical architecture currently being prepared for deployment.',
    longDesc: null,
    tags: ['Systems', 'Python', 'Architecture'],
    category: 'systems',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/imgautamgupta',
    featured: false,
    year: 2024,
    status: 'requires-content', // Verified: No invented functionality
  },
  {
    id: 'more-projects',
    title: 'More Projects & Research Prototypes',
    shortTitle: 'More Projects',
    description:
      'Collection of experimental algorithms, computer vision scripts, utility tools, and exploratory repositories hosted on GitHub.',
    longDesc: null,
    tags: ['Open Source', 'Computer Vision', 'Data Science', 'Tooling'],
    category: 'all',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop',
    link: 'https://github.com/imgautamgupta',
    github: 'https://github.com/imgautamgupta',
    featured: false,
    year: 2024,
    status: 'archive',
  },
];

/** All unique filter categories derived from the project list */
export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Sectors' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'systems', label: 'Systems & Engineering' },
];

/**
 * Filter helper
 * @param {'all' | string} category
 * @returns {object[]}
 */
export const filterProjects = (category) => {
  if (category === 'all') return PROJECTS;
  return PROJECTS.filter((p) => p.category === category);
};
