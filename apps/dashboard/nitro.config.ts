import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  routeRules: {
    // Cache static build assets for 1 year (immutable)
    '/_build/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    },
    
    // Cache public assets for 1 year
    '/assets/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    },
    
    // Cache favicon and icons for 1 year
    '/*.ico': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    '/*.png': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    '/*.svg': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    
    // Cache manifest and robots for 1 day
    '/manifest.json': {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    },
    '/robots.txt': {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    },
    
    // Never cache API endpoints
    '/api/**': {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    },
    
    // SSR pages - don't cache but allow Cloudflare to cache briefly
    '/**': {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },
  },
})
