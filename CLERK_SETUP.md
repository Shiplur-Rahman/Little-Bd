# Clerk setup

1. Open the selected Clerk application and copy its **Publishable key** from the dashboard.
2. Put that key in `clerk-config.js`. It is intended for browser use; never put a Clerk secret key in frontend files.
3. In Clerk, enable the sign-in methods you want (email/password, phone, Google, Facebook) and add the production site domain to the allowed origins/redirect URLs.
4. Clerk's prebuilt sign-in page displays enabled methods automatically. TikTok is not listed in Clerk's current supported social-provider documentation; don't offer it unless Clerk confirms availability or a separate custom OAuth integration is implemented.
5. Test locally on `localhost` and deploy the static site to Vercel. The Clerk CLI initializer did not detect this plain HTML/JavaScript project, so this uses Clerk's supported browser SDK integration without adding a framework or build step.

The configured `pk_test_` key is for development. Use the selected Clerk application's production publishable key for the production domain.
The static auth pages are `login.html` and `sign-up.html`; their Clerk components explicitly link to one another because this site does not have framework-managed `/sign-in` and `/sign-up` routes.

No Railway/FastAPI service is needed for authentication or browser GPS alone. Add a backend only when the site needs server-verified user sessions for actions such as creating orders or saving delivery addresses.
