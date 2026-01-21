// =====================================================
// FORTCENT.COM - GOOGLE ANALYTICS 4 TRACKING LIBRARY
// =====================================================
// This file contains reusable tracking functions for GA4
// Include this AFTER the gtag.js script in your HTML

(function() {
  'use strict';

  // Check if gtag is available
  if (typeof gtag === 'undefined') {
    console.warn('[GA4] gtag not loaded. Analytics tracking disabled.');
    return;
  }

  // ==================
  // UTILITY FUNCTIONS
  // ==================

  /**
   * Send custom event to GA4
   * @param {string} eventName - Name of the event
   * @param {object} eventParams - Event parameters
   */
  function trackEvent(eventName, eventParams = {}) {
    try {
      // Add common parameters
      const params = {
        page_location: window.location.href,
        page_title: document.title,
        ...eventParams
      };

      gtag('event', eventName, params);
      console.log(`[GA4] Event tracked: ${eventName}`, params);
    } catch (error) {
      console.error('[GA4] Error tracking event:', error);
    }
  }

  /**
   * Get link details from an anchor element
   * @param {HTMLElement} element - The anchor element
   * @returns {object} Link details
   */
  function getLinkDetails(element) {
    return {
      link_text: element.textContent.trim(),
      link_url: element.href,
      link_domain: element.hostname,
      is_external: element.hostname !== window.location.hostname
    };
  }

  // ======================
  // CONVERSION TRACKING
  // ======================

  /**
   * Track Buy Button Clicks
   * Tracks when users click the main "Buy CENT on Raydium" button
   */
  window.trackBuyButtonClick = function(element) {
    const linkDetails = getLinkDetails(element);
    trackEvent('buy_button_click', {
      button_text: linkDetails.link_text,
      link_url: linkDetails.link_url,
      button_location: 'buy_section',
      currency: 'USD',
      value: 0 // Can be updated if you want to track estimated purchase value
    });
  };

  /**
   * Track View Reserves Clicks
   * Tracks when users click "View Reserves" or "Transparency" buttons
   */
  window.trackViewReservesClick = function(element) {
    const linkDetails = getLinkDetails(element);
    trackEvent('view_reserves_click', {
      button_text: linkDetails.link_text,
      link_url: linkDetails.link_url,
      button_location: element.closest('section')?.className || 'unknown'
    });
  };

  /**
   * Track Navigation Clicks
   * Tracks main navigation menu interactions
   */
  window.trackNavigationClick = function(element) {
    const linkDetails = getLinkDetails(element);
    trackEvent('navigation_click', {
      link_text: linkDetails.link_text,
      link_url: linkDetails.link_url,
      navigation_type: 'main_nav'
    });
  };

  /**
   * Track Footer Link Clicks
   * Tracks footer navigation clicks
   */
  window.trackFooterClick = function(element) {
    const linkDetails = getLinkDetails(element);
    trackEvent('footer_link_click', {
      link_text: linkDetails.link_text,
      link_url: linkDetails.link_url,
      link_category: 'footer'
    });
  };

  /**
   * Track CTA (Call-to-Action) Clicks
   * Tracks hero section and other prominent CTAs
   */
  window.trackCTAClick = function(element, ctaType) {
    const linkDetails = getLinkDetails(element);
    trackEvent('cta_engagement', {
      cta_type: ctaType || 'general',
      button_text: linkDetails.link_text,
      link_url: linkDetails.link_url
    });
  };

  // ==========================
  // AUTOMATIC EVENT TRACKING
  // ==========================

  /**
   * Initialize automatic tracking when DOM is ready
   */
  function initAutomaticTracking() {
    // Track all buy buttons automatically
    document.querySelectorAll('.buy-button, #raydium-link').forEach(button => {
      button.addEventListener('click', function(e) {
        trackBuyButtonClick(this);
      });
    });

    // Track all "View Reserves" buttons
    document.querySelectorAll('a[href*="transparency"]').forEach(link => {
      link.addEventListener('click', function(e) {
        trackViewReservesClick(this);
      });
    });

    // Track main navigation links
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function(e) {
        trackNavigationClick(this);
      });
    });

    // Track footer links
    document.querySelectorAll('footer a').forEach(link => {
      link.addEventListener('click', function(e) {
        trackFooterClick(this);
      });
    });

    // Track hero CTA buttons
    document.querySelectorAll('.hero-cta .btn').forEach(button => {
      button.addEventListener('click', function(e) {
        const ctaType = this.classList.contains('btn-primary') ? 'hero_primary' : 'hero_secondary';
        trackCTAClick(this, ctaType);
      });
    });

    // Track general CTA section buttons
    document.querySelectorAll('.cta-section .btn').forEach(button => {
      button.addEventListener('click', function(e) {
        const ctaType = this.classList.contains('btn-primary') ? 'bottom_cta_primary' : 'bottom_cta_secondary';
        trackCTAClick(this, ctaType);
      });
    });

    console.log('[GA4] Automatic event tracking initialized');
  }

  // ====================
  // SCROLL DEPTH TRACKING
  // ====================

  /**
   * Track scroll depth milestones
   * Automatically tracks when users scroll 25%, 50%, 75%, 90%
   */
  (function initScrollTracking() {
    const scrollMilestones = [25, 50, 75, 90];
    const trackedMilestones = new Set();

    function calculateScrollPercentage() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      return Math.round(scrollPercentage);
    }

    function handleScroll() {
      const scrollPercent = calculateScrollPercentage();

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackEvent('scroll_depth', {
            percent_scrolled: milestone,
            page_path: window.location.pathname
          });
        }
      });
    }

    // Throttle scroll events to avoid too many calls
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 100);
    });
  })();

  // ========================
  // PAGE-SPECIFIC TRACKING
  // ========================

  /**
   * Track Whitepaper page view
   * Call this on whitepaper.html page load
   */
  window.trackWhitepaperView = function() {
    trackEvent('whitepaper_view', {
      content_type: 'whitepaper',
      document_title: document.title
    });
  };

  /**
   * Track Minting page view
   * Call this on minting.html page load
   */
  window.trackMintingView = function() {
    trackEvent('minting_page_view', {
      content_type: 'minting_instructions',
      page_category: 'conversion'
    });
  };

  /**
   * Track Transparency page view
   * Call this on transparency.html page load
   */
  window.trackTransparencyView = function() {
    trackEvent('transparency_page_view', {
      content_type: 'reserve_data',
      page_category: 'transparency'
    });
  };

  // ======================
  // INITIALIZATION
  // ======================

  // Initialize automatic tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutomaticTracking);
  } else {
    // DOM already loaded
    initAutomaticTracking();
  }

  console.log('[GA4] Tracking library loaded successfully');

})();
