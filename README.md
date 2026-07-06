# AI Mobile Kit

Expo React Native chat app with Clerk authentication and streaming AI responses via the [Ai-web-kit](https://github.com) backend.

## Features

- Email/password and Google sign-in (Clerk)
- Streaming chat with conversation history
- Dark/light theme
- Conversation drawer (new chat, history, clear all)

## Prerequisites

- Node.js 18+
- Python 3.10+ (for the backend in `Ai-web-kit`)
- [Expo Go](https://expo.dev/go) on your phone, or an Android/iOS emulator
- Clerk account ([clerk.com](https://clerk.com))
- Gemini API key in the backend `.env` (see Ai-web-kit backend)

## Setup

### 1. Install dependencies

```bash
cd ai-mobile-kit
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend URL, e.g. `http://192.168.1.30:8000` (use your PC's LAN IP on a physical device) |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key from your Clerk dashboard |

> **Never commit `.env`** — it is listed in `.gitignore`. Only commit `.env.example` with placeholder values.

### 3. Start the backend

The mobile app talks to the Python API in the sibling `Ai-web-kit` project:

```bash
npm run backend
```

The server runs at `http://0.0.0.0:8000`. Confirm it works:

```
http://YOUR_LOCAL_IP:8000/health
```

### 4. Start Expo

```bash
npm start
```

Scan the QR code with **Expo Go**. Your phone and PC must be on the **same Wi‑Fi** when using a LAN API URL.

If the phone cannot reach your PC, try:

```bash
npx expo start --tunnel
```

For the API, you may also need to expose port 8000 (e.g. with ngrok) and update `EXPO_PUBLIC_API_URL`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run backend` | Start Ai-web-kit Python API on port 8000 |
| `npm run android` | Run on Android (requires Android SDK) |
| `npm run ios` | Run on iOS (macOS only) |
| `npm run web` | Run in the browser |

## Project structure

```
ai-mobile-kit/
├── app/              # Expo Router screens (auth, tabs)
├── src/
│   ├── components/   # UI components
│   ├── hooks/        # useChat, useAuth, useTheme
│   ├── services/     # API, chat streaming, auth
│   ├── store/        # Zustand state
│   └── theme/        # Colors, typography, spacing
├── .env.example      # Template for environment variables
└── app.json          # Expo config
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Cannot reach API | Run `npm run backend`, check IP in `.env`, same Wi‑Fi, allow port 8000 in firewall |
| Expo Go won't connect | Use `npx expo start --tunnel` or fix LAN/firewall for port 8081 |
| Readable stream error | Fixed via XHR streaming on native — pull latest code |
| Gemini 429 errors | Free-tier quota exceeded; wait or upgrade API plan |

## License

See [LICENSE](./LICENSE).
