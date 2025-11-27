# Methods Mobile UI (React Native 0.82, Fabric/Hermes on)

React Native 0.82 scaffold matching the provided mockups. Minimum OS targets: **iOS 18** and **Android 12 (API 31)**. New Architecture/Fabric and Hermes are enabled (Android `newArchEnabled=true`, iOS Podfile with `:new_arch_enabled => true`, Hermes on both).

## Tech stack
- React Native 0.82.1 (Fabric/Hermes)
- React Navigation (stack + bottom tabs) with gesture handler/screens
- TypeScript, Reanimated, Linear Gradient

## Project layout
- `App.tsx` – navigation (Splash → PhoneInput → NotificationPrompt → MainTabs).
- `src/theme` – colors, spacing, typography tokens.
- `src/components` – shared UI (buttons, input, notification pill, stat card, chat bubble, list row, top nav, gradient ring placeholder).
- `src/screens` – screen implementations for the mockups.
- Native: `android/`, `ios/` from RN 0.82 template with new-arch toggles.

## Platform targets
- iOS: 18.0 (Podfile + Xcode project deployment target updated).
- Android: minSdk 31, targetSdk 36, new architecture + Hermes enabled.

## Setup
1) Install deps: `npm install` (Node 20+).
2) iOS pods (new arch already enabled in Podfile):
   - `cd ios && bundle exec pod install` (or `RCT_NEW_ARCH_ENABLED=1 pod install`) then `cd ..`.
3) Run:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Metro: `npm start`

## Notes
- The ring illustration uses a gradient placeholder (`src/components/Ring.tsx`); swap in the production asset when ready.
- Gesture handler is initialized via `index.js`; Reanimated plugin is set in `babel.config.js`.

## Remaining work / backlog
1) Platform & build
   - Add production assets (app icons, splash/adaptive icons, ring art, avatars/icons).
   - Wire CI (Fastlane/Bitrise) and signing configs (iOS profiles, Android keystore).
2) Data & integrations
   - Hook real APIs for wallet, payouts, chat, stats; add loading/error states.
   - Push notifications (APNS/FCM), permissions, deep links/universal links.
   - Analytics + crash reporting (Crashlytics/Sentry) with privacy manifests/entitlements.
3) UX polish
   - Haptics for primary CTAs; dynamic type/accessibility labels; refine gradients to brand.
   - Chat input upgrades (attachments/typing state) and list virtualization for history.
4) Offline/perf
   - Add offline cache (SQLite/WatermelonDB/Realm) for wallet/payouts/chat.
   - Profile startup (<1.5s), memory (<120MB), battery (<4%/hr), frame pacing (60/120 FPS).
   - Enable HTTP/3/batching and image caching (WebP/AVIF) for feed/chat avatars.
5) Testing
   - Unit tests for UI state + navigation; integration tests for flows; E2E via Detox/Maestro.
   - Add lint/format hooks and CI checks.
