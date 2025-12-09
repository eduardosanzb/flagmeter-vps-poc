/**
 * FlagMeter Analytics - Privacy-First Generic Tracking
 * 
 * Tracks:
 * 1. Scroll depth (25%, 50%, 75%, 100%) - ALL pages
 * 2. Reading time on exit - ALL pages
 * 3. CTA clicks via [data-cta] attribute - ALL pages
 * 4. External link clicks - ALL pages
 * 
 * Works automatically on all blog posts and landing pages.
 * Zero per-page configuration needed.
 * 
 * Size: ~1.2KB unminified, ~800 bytes minified
 */

(function() {
  'use strict';
  
  // Wait for Umami to load (with retry mechanism)
  let retryCount = 0;
  const maxRetries = 10;
  
  function initTracking() {
    if (typeof umami === 'undefined') {
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(initTracking, 100);
        return;
      } else {
        console.log('[Analytics] Disabled (not in production or Umami not loaded)');
        return;
      }
    }
    
    setupTracking();
  }
  
  function setupTracking() {
    // Detect page type
    const pageType = document.body.classList.contains('blog-post') ? 'blog' : 'landing';
    const pagePath = window.location.pathname;
    
    // Scroll tracking state
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    
    // Reading time tracking
    const readingStartTime = Date.now();

    /**
     * Track scroll depth at 25%, 50%, 75%, 100% milestones
     */
    function trackScroll() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Avoid division by zero on very short pages
      if (height === 0) return;
      
      const scrolled = Math.round((winScroll / height) * 100);

      // Check each milestone
      [25, 50, 75, 100].forEach(milestone => {
        if (scrolled >= milestone && !scrollMilestones[milestone]) {
          scrollMilestones[milestone] = true;
          
          umami.track('scroll', { 
            depth: milestone,
            type: pageType,
            path: pagePath
          });
          
          console.log(`[Analytics] Scroll milestone: ${milestone}% on ${pageType}`);
        }
      });
    }

    /**
     * Debounced scroll listener (150ms delay)
     */
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScroll, 150);
    }, { passive: true });

    /**
     * Track reading time on page exit
     * Only tracks if user spent more than 10 seconds
     */
    window.addEventListener('beforeunload', function() {
      const timeSpent = Math.round((Date.now() - readingStartTime) / 1000);
      
      // Only track meaningful engagement (>10 seconds)
      if (timeSpent > 10) {
        umami.track('reading-time', { 
          seconds: timeSpent,
          type: pageType,
          path: pagePath
        });
        
        console.log(`[Analytics] Reading time: ${timeSpent}s on ${pageType}`);
      }
    });

    /**
     * Auto-track all CTA clicks via [data-cta] attribute
     * Example: <button data-cta="book-workshop">Click Me</button>
     */
    document.addEventListener('click', function(e) {
      // Check if click was on or inside a [data-cta] element
      const cta = e.target.closest('[data-cta]');
      if (cta) {
        const ctaLabel = cta.dataset.cta;
        
        umami.track('cta-click', {
          label: ctaLabel,
          source: pageType,
          path: pagePath
        });
        
        console.log(`[Analytics] CTA clicked: ${ctaLabel} from ${pageType}`);
      }

      /**
       * Auto-track external link clicks
       * Tracks any link that goes to a different hostname
       */
      const link = e.target.closest('a');
      if (link && link.hostname && link.hostname !== window.location.hostname) {
        const destination = link.hostname.replace('www.', '');
        
        umami.track('external-link', {
          destination: destination,
          source: pageType,
          path: pagePath
        });
        
        console.log(`[Analytics] External link clicked: ${destination} from ${pageType}`);
      }
    });

    console.log(`[Analytics] Tracking initialized for ${pageType} page`);
  }
  
  // Start initialization
  initTracking();
})();
