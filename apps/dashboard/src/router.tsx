import { createRouter } from '@tanstack/react-router'

// Initialize telemetry FIRST (server-side only, dev mode only)
// In production, telemetry is initialized via NODE_OPTIONS --require ./telemetry.mjs
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  import('./telemetry-init.server')
}

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    notFoundMode: 'fuzzy',
  })
  return router
}
