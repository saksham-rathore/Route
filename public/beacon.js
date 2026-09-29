/**
 * Route Beacon
 *
 * Lightweight web analytics + performance SDK.
 *
 * Tracks:
 * - Page views
 * - Sessions
 * - Visitors
 * - Custom events
 * - API performance through fetch()
 * - Web Vitals
 * - JavaScript errors
 * - Basic device/browser information
 *
 * Usage:
 *
 * <script
 *   defer
 *   src="https://YOUR-APP.com/beacon.js"
 *   data-pid="my-project"
 *   data-beacon="https://YOUR-APP.com/api/collect">
 * </script>
 *
 * Custom event:
 *
 * Route.track("signup_completed", {
 *   plan: "pro"
 * });
 */

(function () {
  "use strict";

  // 1. INITIALIZATION

  var script =
    document.currentScript ||
    document.querySelector("script[data-pid]");

  if (!script) return;

  var PID = script.getAttribute("data-pid");

  if (!PID) {
    console.warn("[route] Missing data-pid");
    return;
  }

  var BEACON =
    script.getAttribute("data-beacon") ||
    window.location.origin + "/api/collect";

  // 2. BASIC INFORMATION

  var PAGE = window.location.pathname;
  var HOST = window.location.hostname;

  var SESSION_ID =
    "s_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36);

  var VISITOR_ID = getVisitorId();

  var DEVICE = getDeviceInfo();

  // 3. LOCAL VISITOR ID

  function getVisitorId() {
    var key = "route_visitor_id";

    try {
      var existing = localStorage.getItem(key);

      if (existing) {
        return existing;
      }

      var id =
        "v_" +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);

      localStorage.setItem(key, id);

      return id;
    } catch (error) {
      return (
        "v_" +
        Math.random().toString(36).slice(2)
      );
    }
  }

  // 4. DEVICE INFORMATION

  function getDeviceInfo() {
    var ua = navigator.userAgent;

    var device = "desktop";

    if (/Mobi|Android/i.test(ua)) {
      device = "mobile";
    } else if (/Tablet|iPad/i.test(ua)) {
      device = "tablet";
    }

    var browser = "unknown";

    if (ua.includes("Chrome")) {
      browser = "Chrome";
    } else if (ua.includes("Firefox")) {
      browser = "Firefox";
    } else if (ua.includes("Safari")) {
      browser = "Safari";
    } else if (ua.includes("Edge")) {
      browser = "Edge";
    }

    return {
      device: device,
      browser: browser,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language || null
    };
  }

  // 5. EVENT STORAGE

  var events = [];

  var errors = [];

  var vitals = [];

  var measurements = [];

  // 6. COMMON EVENT CREATOR

  function createEvent(type, name, properties) {
    return {
      type: type,
      name: name || null,

      properties: properties || {},

      page: PAGE,

      timestamp: Date.now(),

      session_id: SESSION_ID,

      visitor_id: VISITOR_ID
    };
  }

  // 7. PAGE VIEW

  events.push(
    createEvent("page_view", "page_view", {
      path: PAGE
    })
  );

  // 8. SESSION START

  events.push(
    createEvent("session_start", "session_start", {
      path: PAGE
    })
  );

  // 9. CUSTOM EVENTS

  function track(name, properties) {
    if (!name || typeof name !== "string") {
      return;
    }

    events.push(
      createEvent(
        "custom",
        name,
        properties
      )
    );

    flush();
  }


  // Expose public API
  window.route = window.route || {};

  window.route.track = track;

  // 10. FETCH MONITORING

  var originalFetch = window.fetch;

  if (originalFetch) {
    window.fetch = function (input, init) {

      var url =
        typeof input === "string"
          ? input
          : input && input.url
          ? input.url
          : "";

      var method =
        (init && init.method) ||
        (input && input.method) ||
        "GET";

      // Don't track our own analytics request
      if (url.indexOf(BEACON) !== -1) {
        return originalFetch.apply(
          window,
          arguments
        );
      }

      var start = performance.now();

      var request;

      try {
        request = originalFetch.apply(
          window,
          arguments
        );
      } catch (error) {

        recordApiRequest(
          url,
          method,
          0,
          performance.now() - start
        );

        throw error;
      }

      request.then(
        function (response) {

          recordApiRequest(
            url,
            method,
            response.status,
            performance.now() - start
          );
        },

        function () {

          recordApiRequest(
            url,
            method,
            0,
            performance.now() - start
          );
        }
      );

      return request;
    };
  }

  // 11. API PERFORMANCE

  function recordApiRequest(
    url,
    method,
    status,
    duration
  ) {

    if (!url) return;

    measurements.push({
      type: "api_request",

      url: sanitizeUrl(url),

      method: method || "GET",

      status: status,

      duration: Math.round(duration),

      page: PAGE,

      timestamp: Date.now()
    });
  }

  // 12. URL SANITIZATION

  function sanitizeUrl(url) {

    try {

      var parsed = new URL(
        url,
        window.location.href
      );

      return (
        parsed.protocol +
        "//" +
        parsed.hostname +
        parsed.pathname
      );

    } catch (error) {

      return String(url);
    }
  }

  // 13. WEB VITALS

  function addVital(
    name,
    value,
    rating
  ) {

    vitals.push({
      type: "web_vital",

      name: name,

      value: Math.round(value),

      rating: rating,

      page: PAGE,

      timestamp: Date.now()
    });
  }


  function rateLCP(value) {

    if (value <= 2500) {
      return "good";
    }

    if (value <= 4000) {
      return "needs-improvement";
    }

    return "poor";
  }


  function rateCLS(value) {

    if (value <= 0.1) {
      return "good";
    }

    if (value <= 0.25) {
      return "needs-improvement";
    }

    return "poor";
  }


  function rateINP(value) {

    if (value <= 200) {
      return "good";
    }

    if (value <= 500) {
      return "needs-improvement";
    }

    return "poor";
  }


  function rateFCP(value) {

    if (value <= 1800) {
      return "good";
    }

    if (value <= 3000) {
      return "needs-improvement";
    }

    return "poor";
  }


  function rateTTFB(value) {

    if (value <= 800) {
      return "good";
    }

    if (value <= 1800) {
      return "needs-improvement";
    }

    return "poor";
  }


  // 14. PERFORMANCE OBSERVER

  if (
    typeof PerformanceObserver !==
    "undefined"
  ) {

    // LCP

    try {

      var lcpObserver =
        new PerformanceObserver(
          function (list) {

            var entries =
              list.getEntries();

            var last =
              entries[entries.length - 1];

            if (last) {

              addVital(
                "LCP",
                last.startTime,
                rateLCP(last.startTime)
              );
            }
          }
        );

      lcpObserver.observe({
        type: "largest-contentful-paint",
        buffered: true
      });

    } catch (error) {}


    // CLS

    var clsValue = 0;

    try {

      var clsObserver =
        new PerformanceObserver(
          function (list) {

            var entries =
              list.getEntries();

            for (
              var i = 0;
              i < entries.length;
              i++
            ) {

              var entry =
                entries[i];

              if (!entry.hadRecentInput) {

                clsValue += entry.value;
              }
            }
          }
        );

      clsObserver.observe({
        type: "layout-shift",
        buffered: true
      });

    } catch (error) {}


    // INP

    var inpMax = 0;

    try {

      var inpObserver =
        new PerformanceObserver(
          function (list) {

            var entries =
              list.getEntries();

            for (
              var i = 0;
              i < entries.length;
              i++
            ) {

              var duration =
                entries[i].duration || 0;

              if (duration > inpMax) {

                inpMax = duration;
              }
            }
          }
        );

      inpObserver.observe({
        type: "event",
        buffered: true,
        durationThreshold: 16
      });

    } catch (error) {}

    // FCP

    try {

      var fcpObserver =
        new PerformanceObserver(
          function (list) {

            var entries =
              list.getEntries();

            for (
              var i = 0;
              i < entries.length;
              i++
            ) {

              if (
                entries[i].name ===
                "first-contentful-paint"
              ) {

                addVital(
                  "FCP",
                  entries[i].startTime,
                  rateFCP(
                    entries[i].startTime
                  )
                );
              }
            }
          }
        );

      fcpObserver.observe({
        type: "paint",
        buffered: true
      });

    } catch (error) {}


    // FINAL VITALS

    var vitalsFlushed = false;

    function flushVitals() {

      if (vitalsFlushed) {
        return;
      }

      vitalsFlushed = true;


      // CLS
      addVital(
        "CLS",
        clsValue * 1000,
        rateCLS(clsValue)
      );


      // INP
      if (inpMax > 0) {

        addVital(
          "INP",
          inpMax,
          rateINP(inpMax)
        );
      }


      // TTFB
      try {

        var navigation =
          performance.getEntriesByType(
            "navigation"
          )[0];

        if (navigation) {

          var ttfb =
            Math.max(
              0,
              navigation.responseStart -
                navigation.requestStart
            );

          addVital(
            "TTFB",
            ttfb,
            rateTTFB(ttfb)
          );
        }

      } catch (error) {}
    }


    window.addEventListener(
      "pagehide",
      flushVitals
    );

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
          "hidden"
        ) {

          flushVitals();
        }
      }
    );
  }

  // 15. JAVASCRIPT ERRORS

  window.addEventListener(
    "error",
    function (event) {

      if (
        event.message ===
        "Script error."
      ) {
        return;
      }

      errors.push({

        type: "javascript_error",

        message:
          event.message || null,

        filename:
          event.filename || null,

        line:
          event.lineno || null,

        column:
          event.colno || null,

        page: PAGE,

        timestamp: Date.now()
      });
    }
  );

  // 16. UNHANDLED PROMISE ERRORS

  window.addEventListener(
    "unhandledrejection",
    function (event) {

      var message = null;

      try {

        message =
          event.reason &&
          event.reason.message
            ? event.reason.message
            : String(event.reason);

      } catch (error) {

        message =
          "Unknown promise rejection";
      }

      errors.push({

        type: "promise_error",

        message: message,

        page: PAGE,

        timestamp: Date.now()
      });
    }
  );

  // 17. BUILD PAYLOAD

  function buildPayload() {

    return JSON.stringify({

      project_id: PID,

      session_id: SESSION_ID,

      visitor_id: VISITOR_ID,

      host: HOST,

      page: PAGE,

      device: DEVICE,

      events: events,

      measurements: measurements,

      vitals: vitals,

      errors: errors
    });
  }

  // 18. SEND DATA

  function flush() {

    if (
      events.length === 0 &&
      measurements.length === 0 &&
      vitals.length === 0 &&
      errors.length === 0
    ) {
      return;
    }


    var body =
      buildPayload();


    // Clear queues before sending
    events = [];
    measurements = [];
    vitals = [];
    errors = [];

    // sendBeacon

    try {

      if (
        navigator.sendBeacon
      ) {

        var sent =
          navigator.sendBeacon(
            BEACON,
            new Blob(
              [body],
              {
                type:
                  "application/json"
              }
            )
          );

        if (sent) {
          return;
        }
      }

    } catch (error) {}


    // fetch fallback

    try {

      fetch(BEACON, {

        method: "POST",

        body: body,

        keepalive: true,

        headers: {
          "Content-Type":
            "application/json"
        }
      }).catch(function () {});

    } catch (error) {}
  }


  // 19. AUTOMATIC FLUSH

  window.addEventListener(
    "pagehide",
    flush
  );


  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.visibilityState ===
        "hidden"
      ) {

        flush();
      }
    }
  );


  // Send every 10 seconds
  setInterval(
    flush,
    10000
  );


  // Initial flush after 15 seconds
  setTimeout(
    flush,
    15000
  );


  // 20. DEBUG MODE
  
  if (
    script.getAttribute("data-debug") ===
    "true"
  ) {

    console.log(
      "[route] Beacon initialized"
    );

    console.log(
      "[route] Project:",
      PID
    );

    console.log(
      "[route] Session:",
      SESSION_ID
    );

    console.log(
      "[route] Visitor:",
      VISITOR_ID
    );

    console.log(
      "[route] Device:",
      DEVICE
    );
  }

})();