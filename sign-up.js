const status = document.querySelector("#signup-auth-status");
const signUpContainer = document.querySelector("#clerk-sign-up");

window.hilltopClerkReady
  .then((clerk) => {
    if (!clerk) {
      status.textContent = "Secure sign-up is not configured. Check the Clerk publishable key in clerk-config.js.";
      return;
    }

    status.hidden = true;
    if (clerk.isSignedIn) {
      window.location.replace("index.html");
      return;
    }

    clerk.mountSignUp(signUpContainer, {
      routing: "hash",
      signInUrl: `${window.location.origin}/login.html`,
      fallbackRedirectUrl: `${window.location.origin}/index.html`,
      signInFallbackRedirectUrl: `${window.location.origin}/index.html`,
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
    console.error("Unable to initialize Clerk sign-up.", error);
    status.textContent = "Secure sign-up could not load. Please try again later.";
  });
