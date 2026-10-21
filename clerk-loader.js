(() => {
  const publishableKey = window.hilltopClerkConfig?.publishableKey?.trim();

  function loadScript(src, attributes = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";
      Object.entries(attributes).forEach(([name, value]) => {
        script.setAttribute(name, value);
      });
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  window.hilltopClerkReady = (async () => {
    if (!publishableKey) {
      return null;
    }

    const encodedFrontendApi = publishableKey.split("_")[2];
    if (!encodedFrontendApi) {
      throw new Error("The Clerk publishable key is invalid.");
    }

    let frontendApi;
    try {
      frontendApi = atob(encodedFrontendApi).slice(0, -1);
    } catch (error) {
      throw new Error("The Clerk publishable key is invalid.", { cause: error });
    }

    await loadScript(`https://${frontendApi}/npm/@clerk/ui@1/dist/ui.browser.js`);
    await loadScript(`https://${frontendApi}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
      "data-clerk-publishable-key": publishableKey,
    });

    if (!window.Clerk) {
      throw new Error("Clerk loaded without creating its client.");
    }

    await window.Clerk.load({
      ui: { ClerkUI: window.__internal_ClerkUICtor },
    });
    return window.Clerk;
  })();
})();
