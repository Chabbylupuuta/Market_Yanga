# Market Yanga

Market Yanga uses a **separate Firebase project** from Zara-Chabby. Its Firebase configuration is wired into the login flow (project ID: `market-yanga-log-in`); it does not use Zara-Chabby's Firebase credentials or browser session key.

## Configure Market Yanga authentication

1. In the Market Yanga Firebase project, enable **Authentication → Sign-in method → Email/Password**.
2. Add `localhost` and your Market Yanga production hostname under **Authentication → Settings → Authorized domains**.
3. The web API key is configured as the default in `src/AuthController.tsx`. If you want to override it for another environment, set `VITE_FIREBASE_API_KEY` to the Market Yanga project's Web API key in `.env.local` or your hosting provider's environment variables, then rebuild/redeploy the frontend.
4. Keep Zara-Chabby deployed/configured with its own separate Firebase project.

The Firebase web API key is a public client identifier, not a server secret. Keep Firebase security rules and Authentication settings configured appropriately. Do not put Firebase Admin credentials or service-account private keys in frontend code.

Market Yanga uses a distinct browser-storage key for its saved sign-in session. Its Firebase Authentication accounts are in the separate `market-yanga-log-in` project and do not mix with Zara-Chabby's account directory.
