(function () {
  'use strict';

  // 1. Find the script tag to get the Project ID and API endpoint
  const currentScript = document.currentScript || document.querySelector('script[data-project-id]');
  if (!currentScript) {
    console.error('Analytics: Missing script tag or data-project-id attribute.');
    return;
  }

  const projectId = currentScript.getAttribute('data-project-id');
  // In production, this should point to your hosted app (e.g., https://your-app.com/api/beacon)
  const endpoint = currentScript.getAttribute('data-api-url') || 'http://localhost:3000/api/beacon';
  
  let lastPage = location.pathname;

  // 2. Generate unique identifiers for visitor and session
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  let sessionId = sessionStorage.getItem('__raah_session_id');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('__raah_session_id', sessionId);
  }

  let visitorId = localStorage.getItem('__raah_visitor_id');
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem('__raah_visitor_id', visitorId);
  }

  // 3. Prepare the data payload
  function getPayload(eventType = 'PAGEVIEW', extraData = {}) {
    return {
      projectId,
      sessionId,
      visitorId,
      eventType,
      pageUrl: location.href,
      pagePath: location.pathname,
      referrer: document.referrer,
      screenWidth: window.innerWidth,
      ...extraData
    };
  }

  // 4. Send the event to your Next.js backend
  function sendEvent(eventType = 'PAGEVIEW', extraData = {}) {
    if (!projectId) return;
    
    const payload = getPayload(eventType, extraData);
    
    // We use sendBeacon so the event fires reliably even if the user is closing the tab
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
    }
  }

  // --- Automatic Tracking ---

  // Track initial page view
  sendEvent('PAGEVIEW');

  // Track Single Page App (SPA) navigations (e.g., Next.js, React, Vue)
  const pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(this, arguments);
    handleRouteChanged();
  };

  const replaceState = history.replaceState;
  history.replaceState = function () {
    replaceState.apply(this, arguments);
    handleRouteChanged();
  };

  window.addEventListener('popstate', handleRouteChanged);

  function handleRouteChanged() {
    // Only fire if the path actually changed
    if (lastPage !== location.pathname) {
      lastPage = location.pathname;
      sendEvent('PAGEVIEW');
    }
  }

  // Track JavaScript Errors
  window.addEventListener('error', function (e) {
    sendEvent('JAVASCRIPT_ERROR', {
      errorMessage: e.message,
      metadata: {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      }
    });
  });

  // (Optional) Expose a global object for custom event tracking
  window.raah = window.raah || {};
  window.raah.track = function(eventName, metadata) {
    // Note: You would need to add CUSTOM to your Prisma EventType enum for this to work
    // sendEvent('CUSTOM', { eventName, metadata });
  }
})();
