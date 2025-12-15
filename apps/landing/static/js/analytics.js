/**
 * FlagMeter Analytics - Privacy-First Generic Tracking
 * 
 * Tracks:
 * 1. Page views with enhanced bot detection
 * 2. Scroll depth (25%, 50%, 75%, 100%) - ALL pages
 * 3. Reading time on exit - ALL pages
 * 4. CTA clicks via [data-cta] attribute - ALL pages
 * 5. External link clicks - ALL pages
 * 
 * Works automatically on all blog posts and landing pages.
 * Zero per-page configuration needed.
 * 
 * Size: ~1.2KB unminified, ~800 bytes minified
 */

(function() {
  'use strict';
  
  // Suspicious referrers to filter out
  const SUSPICIOUS_REFERRERS = [
    'spyhost.site',
    'porn',
    'xxx',
    'sex',
    'casino',
    'gambling',
    'seo'
  ];
  
  // Wait for Umami to load (with retry mechanism)
  let retryCount = 0;
  const maxRetries = 10;
  
  // Check if referrer is suspicious
  function isSuspiciousReferrer() {
    const referrer = document.referrer;
    if (!referrer) return false;
    
    return SUSPICIOUS_REFERRERS.some(bad => 
      referrer.toLowerCase().includes(bad.toLowerCase())
    );
  }
  
  // Check if user agent looks like a bot
  function isLikelyBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botIndicators = [
      'bot', 'crawler', 'spider', 'curl', 'wget', 'monitor',
      'headless', 'phantom', 'slurp', 'mediapartners-google'
    ];
    
    return botIndicators.some(indicator => 
      userAgent.includes(indicator)
    );
  }
  
  // Enhanced engagement validation
  function isValidEngagement() {
    // If suspicious referrer or likely bot, don't track
    if (isSuspiciousReferrer() || isLikelyBot()) {
      return false;
    }
    
    // Require some minimum interaction time (5 seconds)
    if (Date.now() - window.analyticsStartTime < 5000) {
      return false;
    }
    
    return true;
  }
  
  // Track page view with enhanced validation
  function trackPageView(pageType, pagePath) {
    // Enhanced bot detection
    if (isSuspiciousReferrer() || isLikelyBot()) {
      console.log('[Analytics] Blocked bot traffic');
      return;
    }
    
    // Track page view manually
    if (typeof umami !== 'undefined') {
      umami.track('pageview', {
        type: pageType,
        path: pagePath,
        referrer: document.referrer,
        // Include additional context for better analysis
        screenWidth: screen.width,
        screenHeight: screen.height,
        userAgent: navigator.userAgent.substring(0, 100) // Truncate for privacy
      });
      
      console.log(`[Analytics] Page view tracked: ${pageType} - ${pagePath}`);
    }
  }
  
  function initTracking() {
    // Record start time for engagement validation
    window.analyticsStartTime = Date.now();
    
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
    
    // If suspicious referrer, don't initialize tracking
    if (isSuspiciousReferrer()) {
      console.log('[Analytics] Blocked suspicious referrer:', document.referrer);
      return;
    }
    
    setupTracking();
  }
  
  function setupTracking() {
    // Detect page type
    const pageType = document.body.classList.contains('blog-post') ? 'blog' : 'landing';
    const pagePath = window.location.pathname;
    
    // Track page view with enhanced bot detection
    trackPageView(pageType, pagePath);
    
    // Scroll tracking state
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    
    // Reading time tracking
    const readingStartTime = Date.now();

    /**
     * Track scroll depth at 25%, 50%, 75%, 100% milestones
     */
    function trackScroll() {
      // Validate engagement before tracking
      if (!isValidEngagement()) return;
      
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
            path: pagePath,
            // Include engagement time for better analysis
            engagementSeconds: Math.round((Date.now() - window.analyticsStartTime) / 1000)
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
     * Track reading time on page exit using sendBeacon
     * Only tracks if user spent more than 10 seconds and had meaningful engagement
     * 
     * Uses visibilitychange event (more reliable than beforeunload)
     * and umami.track() which internally uses sendBeacon when available
     */
    window.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        // Validate engagement before tracking
        if (!isValidEngagement()) return;
        
        const timeSpent = Math.round((Date.now() - readingStartTime) / 1000);
        
        // Only track meaningful engagement (>10 seconds)
        if (timeSpent > 10) {
          // umami.track() uses navigator.sendBeacon internally for reliable delivery
          umami.track('reading-time', { 
            seconds: timeSpent,
            type: pageType,
            path: pagePath,
            // Include scroll depth for better analysis
            maxScrollDepth: Math.max(...Object.keys(scrollMilestones).filter(k => scrollMilestones[k]))
          });
          
          console.log(`[Analytics] Reading time: ${timeSpent}s on ${pageType}`);
        }
      }
    });

    /**
     * Auto-track all CTA clicks via [data-cta] attribute
     * Example: <button data-cta="book-workshop">Click Me</button>
     */
    document.addEventListener('click', function(e) {
      // Validate engagement before tracking
      if (!isValidEngagement()) return;
      
      // Check if click was on or inside a [data-cta] element
      const cta = e.target.closest('[data-cta]');
      if (cta) {
        const ctaLabel = cta.dataset.cta;
        
        umami.track('cta-click', {
          label: ctaLabel,
          source: pageType,
          path: pagePath,
          // Include engagement time for better analysis
          engagementSeconds: Math.round((Date.now() - window.analyticsStartTime) / 1000)
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
        
        // Skip tracking for suspicious destinations
        if (SUSPICIOUS_REFERRERS.some(bad => destination.includes(bad))) {
          return;
        }
        
        umami.track('external-link', {
          destination: destination,
          source: pageType,
          path: pagePath,
          engagementSeconds: Math.round((Date.now() - window.analyticsStartTime) / 1000)
        });
        
        console.log(`[Analytics] External link clicked: ${destination} from ${pageType}`);
      }
    });

    console.log(`[Analytics] Tracking initialized for ${pageType} page`);
  }
  
  // Start initialization
  initTracking();
})();