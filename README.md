# SeatGo

Unified urban transport app for Skopje — taxi, bus, and train in one map-centric experience.

## Run the app

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS simulator, or scan the QR code with Expo Go.

For native builds with maps:

```bash
npx expo run:android
npx expo run:ios
```

### Android maps API key (required for `expo run:android`)

Native Android builds use Google Maps and **require an API key**. Without it you will see a red error screen.

1. Create a key in [Google Cloud Console](https://console.cloud.google.com/) with **Maps SDK for Android** enabled.
2. Copy `.env.example` to `.env` and set your key:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
   ```
3. Rebuild the native app:
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```

Until you add a key, the app shows a **map preview placeholder** on Android instead of crashing. Schedules, routing, tickets, and wallet still work.

**Expo Go:** Press `a` after `npx expo start` — maps usually work without your own key.

Location permission is requested on first launch; if denied, the app defaults to central Skopje.

## Demo flows

### Guest mode

1. Launch app → **Continue as guest**
2. Home map shows nearby bus stops, train stations, and taxis
3. Tap **Where to?** → pick a destination → view route options with ETA, time, and price
4. Open Tickets / Wallet / try taxi confirm → **Sign in to continue** modal appears

### Authenticated user

1. **Continue with account** → sign in with any email/password
2. Search destination → open route details → **Buy ticket** → QR ticket appears in Tickets tab
3. Choose taxi route → **Call taxi** → confirm booking → driver assigned with map tracking
4. Wallet → **Top up** → balance and transaction history update

## What is mocked vs real

| Feature | Status |
|---------|--------|
| Auth (email/password) | Mock — stored locally only |
| Bus/train schedules | Mock — generated relative to current time |
| Route planning | Mock — Skopje sample routes |
| Taxi dispatch | Mock — simulated driver assignment |
| Payments / top-up | Mock — no real charges |
| Maps | Real map view; data is mocked |
| Location | Real when permitted; Skopje fallback |

## Project structure

```
src/
  app/           Expo Router routes
  features/      Feature screens & components
  services/      Data access (swap for real APIs here)
  stores/        Zustand state
  data/mock/     Sample Skopje transit data
  types/         Shared TypeScript types
  components/ui/ Shared UI primitives
```

## Plugging in real APIs

Replace mock implementations in:

- [`src/services/transitService.ts`](src/services/transitService.ts) — live arrivals, stops, lines
- [`src/services/routingService.ts`](src/services/routingService.ts) — multimodal routing engine
- [`src/services/taxiService.ts`](src/services/taxiService.ts) — taxi ETA, pricing, booking
- [`src/stores/authStore.ts`](src/stores/authStore.ts) — real authentication backend
- [`src/stores/walletStore.ts`](src/stores/walletStore.ts) — payment provider (Stripe, etc.)

For production Google Maps on Android/iOS, add API keys to `app.json`:

```json
["react-native-maps", {
  "iosGoogleMapsApiKey": "YOUR_KEY",
  "androidGoogleMapsApiKey": "YOUR_KEY"
}]
```

Then rebuild with `npx expo prebuild` and `npx expo run:android` / `run:ios`.

## Tech stack

- Expo 56 + React Native + TypeScript
- Expo Router (file-based navigation)
- Zustand (state)
- react-native-maps
- @gorhom/bottom-sheet + Reanimated (motion)
- react-native-qrcode-svg (ticket QR codes)

## Design

Black, white, and grayscale only. Design tokens live in [`src/constants/theme.ts`](src/constants/theme.ts).
