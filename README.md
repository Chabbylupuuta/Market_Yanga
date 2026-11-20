# Market Yanga

Market Yanga uses a **separate Firebase project** from Zara-Chabby. Create a dedicated Firebase project for this app and configure its web API key; do not copy credentials from Zara-Chabby. Firebase Authentication users are scoped to a Firebase project, so this separation keeps the apps' account directories separate.

## Configure Market Yanga authentication

1. Create a new Firebase project specifically for Market Yanga at https://console.firebase.google.com/.
2. In that project, add a Web app and copy its Firebase Web API key.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Add `localhost` and your Market Yanga production hostname under **Authentication → Settings → Authorized domains**.
5. Set `VITE_FIREBASE_API_KEY` to the new Market Yanga project's Web API key in your local `.env.local` file and in your hosting provider's environment variables, then rebuild/redeploy the frontend.
6. Keep Zara-Chabby deployed/configured with its own separate Firebase project.

Example local config (replace the placeholder with the Market Yanga key only):

```dotenv
VITE_FIREBASE_API_KEY=your_market_yanga_firebase_web_api_key
```

The web API key is a public Firebase client identifier, not a server secret. Keep Firebase security rules and Authentication settings configured appropriately. Do not put Firebase Admin credentials or service-account private keys in frontend code.

Until the Market Yanga key is configured, its login displays a setup message and does not send authentication requests. Market Yanga uses a separate browser-storage key as well, so its saved sign-in session is not shared with Zara-Chabby.
