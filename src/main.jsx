import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ─── 1. Register all GSAP plugins (must happen before any component renders) ───
// This import has the side effect of calling gsap.registerPlugin().
// Do NOT call gsap.registerPlugin() anywhere else in the codebase.
import './animation/gsap.js'

// ─── 2. Initialise smooth scrolling (single RAF loop) ───────────────────────
import { initScroll, destroyScroll } from './utils/scroll.js'
initScroll()

// ─── 3. Initialise global interaction manager ───────────────────────────────
import { InteractionManager } from './experience/InteractionManager.js'
InteractionManager.getInstance().init()

// ─── 4. HMR cleanup (development only) ──────────────────────────────────────
// Prevents duplicate Lenis instances and dangling RAF loops during hot reload.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    destroyScroll()
    InteractionManager.destroy()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
