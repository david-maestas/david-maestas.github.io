(() => {
  "use strict";

  const GA_MEASUREMENT_ID = "G-HLYDVDVPLS";
  const CONSENT_KEY = "dm_analytics_consent_v1";
  const OWNER_OPT_OUT_KEY = "dm_analytics_owner_opt_out_v1";
  const GA_SCRIPT_ID = "dm-ga4-script";
  const BANNER_ID = "analytics-consent";
  const TOAST_ID = "analytics-notice";

  let analyticsStarted = false;
  let pageViewSent = false;
  let debugMode = false;
  const memoryStorage = new Map();

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key) || memoryStorage.get(key) || null;
      } catch (error) {
        return memoryStorage.get(key) || null;
      }
    },
    set(key, value) {
      memoryStorage.set(key, value);
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        // The site remains usable when storage is unavailable.
      }
    },
    remove(key) {
      memoryStorage.delete(key);
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        // The site remains usable when storage is unavailable.
      }
    }
  };

  function pageName() {
    const fileName = window.location.pathname.split("/").pop() || "index.html";
    return fileName.replace(/\.html$/i, "") === "index" ? "home" : toSnakeCase(fileName.replace(/\.html$/i, ""));
  }

  function toSnakeCase(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 100);
  }

  function sanitizedPageLocation() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  function removeAnalyticsCookies() {
    const hostParts = window.location.hostname.split(".");
    const domains = [window.location.hostname];

    for (let index = 0; index < hostParts.length - 1; index += 1) {
      domains.push(`.${hostParts.slice(index).join(".")}`);
    }

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!name.startsWith("_ga")) {
        return;
      }

      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
      });
    });
  }

  function readRuntimeOptions() {
    const url = new URL(window.location.href);
    const ownerOptOut = url.searchParams.get("analytics_owner_opt_out") === "1";
    const ownerOptIn = url.searchParams.get("analytics_owner_opt_in") === "1";
    debugMode = url.searchParams.get("analytics_debug") === "1";

    if (ownerOptOut) {
      storage.set(OWNER_OPT_OUT_KEY, "1");
      removeAnalyticsCookies();
    } else if (ownerOptIn) {
      storage.remove(OWNER_OPT_OUT_KEY);
    }

    const optionNames = ["analytics_owner_opt_out", "analytics_owner_opt_in", "analytics_debug"];
    let changed = false;
    optionNames.forEach((name) => {
      if (url.searchParams.has(name)) {
        url.searchParams.delete(name);
        changed = true;
      }
    });

    if (changed && window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
    }

    return { ownerOptOut, ownerOptIn, debugMode };
  }

  const runtimeOptions = readRuntimeOptions();

  function ownerOptedOut() {
    return storage.get(OWNER_OPT_OUT_KEY) === "1";
  }

  function currentConsent() {
    const value = storage.get(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  }

  function showNotice(message) {
    const existing = document.getElementById(TOAST_ID);
    if (existing) {
      existing.remove();
    }

    const notice = document.createElement("div");
    notice.id = TOAST_ID;
    notice.className = "analytics-notice";
    notice.setAttribute("role", "status");
    notice.textContent = message;
    document.body.appendChild(notice);
    window.setTimeout(() => notice.remove(), 5000);
  }

  function hideBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) {
      banner.hidden = true;
    }
  }

  function setConsent(value) {
    storage.set(CONSENT_KEY, value);

    if (value === "granted" && !ownerOptedOut()) {
      hideBanner();
      startAnalytics();
      showNotice("Analytics enabled. You can change this choice at any time.");
      return;
    }

    removeAnalyticsCookies();
    hideBanner();

    if (analyticsStarted) {
      window.location.reload();
      return;
    }

    showNotice("Analytics disabled.");
  }

  function createBanner() {
    if (document.getElementById(BANNER_ID)) {
      return document.getElementById(BANNER_ID);
    }

    const banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.className = "analytics-consent";
    banner.setAttribute("aria-labelledby", "analytics-consent-title");
    banner.setAttribute("role", "dialog");
    banner.innerHTML = `
      <div class="analytics-consent__inner">
        <div class="analytics-consent__copy">
          <h2 id="analytics-consent-title">Privacy choices</h2>
          <p>Optional analytics help me understand which pages, publications, and resources visitors use. Analytics are not used for advertising.</p>
        </div>
        <div class="analytics-consent__actions">
          <button class="button consent-button" type="button" data-consent-choice="granted">Allow analytics</button>
          <button class="button button-outline consent-button" type="button" data-consent-choice="denied">No thanks</button>
          <a class="button button-outline consent-button" href="privacy.html">Privacy</a>
        </div>
      </div>`;

    banner.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-consent-choice]");
      if (choice) {
        setConsent(choice.dataset.consentChoice);
      }
    });

    const header = document.querySelector(".site-header");
    if (header) {
      header.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }
    return banner;
  }

  function showBanner() {
    const banner = createBanner();
    banner.hidden = false;
    const firstAction = banner.querySelector("button, a");
    if (firstAction && currentConsent()) {
      firstAction.focus();
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function debugLog(eventName, parameters) {
    if (!debugMode) {
      return;
    }

    try {
      console.info("[dm-analytics-debug]", JSON.stringify({ event: eventName, parameters }));
    } catch (error) {
      // Debug logging must never interfere with navigation or analytics.
    }
  }

  function sendPageView() {
    if (pageViewSent || !analyticsStarted) {
      return;
    }

    pageViewSent = true;
    const parameters = {
      page_title: document.title,
      page_location: sanitizedPageLocation(),
      page_path: window.location.pathname,
      source_page: pageName(),
      ...(debugMode ? { debug_mode: true } : {})
    };
    debugLog("page_view", parameters);
    gtag("event", "page_view", parameters);
  }

  function startAnalytics() {
    if (analyticsStarted || ownerOptedOut() || currentConsent() !== "granted") {
      return;
    }

    if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) {
      return;
    }

    analyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("js", new Date());

    // Automatic page views are disabled so consent produces exactly one explicit page_view.
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      page_location: sanitizedPageLocation(),
      page_path: window.location.pathname,
      ...(debugMode ? { debug_mode: true } : {})
    });
    sendPageView();

    if (!document.getElementById(GA_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
      script.addEventListener("error", () => {
        analyticsStarted = false;
      });
      document.head.appendChild(script);
    }
  }

  function safeDestination(link) {
    try {
      const destination = new URL(link.href, window.location.href);
      if (destination.protocol !== "http:" && destination.protocol !== "https:") {
        return { domain: "", path: "" };
      }

      return {
        domain: destination.hostname.toLowerCase().slice(0, 100),
        path: destination.pathname.slice(0, 200)
      };
    } catch (error) {
      return { domain: "", path: "" };
    }
  }

  function safeFileName(link) {
    try {
      const destination = new URL(link.href, window.location.href);
      const fileName = destination.pathname.split("/").pop() || "cv.pdf";
      return /^[a-z0-9._-]+$/i.test(fileName) ? fileName.slice(0, 120) : "cv.pdf";
    } catch (error) {
      return "cv.pdf";
    }
  }

  function sendEvent(name, parameters) {
    if (!analyticsStarted || ownerOptedOut() || currentConsent() !== "granted") {
      return;
    }

    const sanitizedParameters = {
      ...parameters,
      ...(debugMode ? { debug_mode: true } : {})
    };
    debugLog(name, sanitizedParameters);
    gtag("event", name, sanitizedParameters);
  }

  function trackLink(link) {
    const category = toSnakeCase(link.dataset.analyticsCategory);
    const label = toSnakeCase(link.dataset.analyticsLabel);
    const placement = toSnakeCase(link.dataset.analyticsPlacement);

    if (!category || !label || !placement) {
      return;
    }

    const destination = safeDestination(link);
    const sourcePage = pageName();
    sendEvent("site_link_click", {
      link_category: category,
      link_label: label,
      link_placement: placement,
      destination_domain: destination.domain,
      destination_path: destination.path,
      source_page: sourcePage
    });

    if (category === "cv") {
      sendEvent("cv_download", {
        file_name: safeFileName(link),
        link_placement: placement,
        source_page: sourcePage
      });
    }

    if (category === "contact" && link.dataset.analyticsContactMethod === "email") {
      sendEvent("contact_click", {
        contact_method: "email",
        link_placement: placement,
        source_page: sourcePage
      });
    }
  }

  function initializePage() {
    document.addEventListener("click", (event) => {
      const privacyChoices = event.target.closest("[data-analytics-privacy-choices]");
      if (privacyChoices) {
        event.preventDefault();
        showBanner();
        return;
      }

      const link = event.target.closest("a[data-analytics-category]");
      if (link) {
        trackLink(link);
      }
    });

    if (runtimeOptions.ownerOptOut) {
      showNotice("Owner analytics opt-out is active on this browser.");
      return;
    }

    if (runtimeOptions.ownerOptIn) {
      showNotice("Owner opt-out cleared. Choose whether to allow analytics.");
      showBanner();
      return;
    }

    if (ownerOptedOut()) {
      return;
    }

    if (currentConsent() === "granted") {
      startAnalytics();
    } else if (!currentConsent()) {
      showBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage, { once: true });
  } else {
    initializePage();
  }
})();
