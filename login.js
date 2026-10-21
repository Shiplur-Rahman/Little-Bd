const status = document.querySelector("#login-auth-status");
const signInContainer = document.querySelector("#clerk-sign-in");

window.hilltopClerkReady
  .then((clerk) => {
    if (!clerk) {
      status.textContent = "Secure sign-in is not configured yet. Add the Clerk publishable key to clerk-config.js.";
      return;
    }

    status.hidden = true;
    if (clerk.isSignedIn) {
      window.location.replace("index.html");
      return;
    }

    clerk.mountSignIn(signInContainer, {
      routing: "hash",
      signUpUrl: `${window.location.origin}/sign-up.html`,
      fallbackRedirectUrl: `${window.location.origin}/index.html`,
      signUpFallbackRedirectUrl: `${window.location.origin}/index.html`,
      appearance: {
        variables: {
          colorPrimary: "#a8323e",
          colorBackground: "#fffdfa",
          colorText: "#342321",
          borderRadius: "0.75rem",
          fontFamily: '"DM Sans", sans-serif',
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
        },
      },
    });
  })
  .catch((error) => {
    console.error("Unable to initialize Clerk.", error);
    status.textContent = "Secure sign-in could not load. Please try again later.";
  });
