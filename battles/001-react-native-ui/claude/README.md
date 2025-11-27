# Methods App

A React Native mobile app for content creators to track earnings, collaborate with other creators, and discover content ideas.

![UI Preview](ui.jpeg)

## Features

- **Explore**: Discover trending content methods and join creator groups
- **Analytics**: Track earnings, views, and engagement metrics
- **Ideas**: Get AI-powered content inspiration based on your niche
- **Account**: Manage wallet, payment methods, and notifications
- **Chat**: Collaborate with other creators in group chats
- **Cashout**: Withdraw earnings to your payment method

## Tech Stack

- **Framework**: React Native 0.74.1
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Icons**: react-native-svg
- **Styling**: StyleSheet with design tokens

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd methods-app

# Install dependencies
npm install

# iOS only: Install CocoaPods dependencies
npm run pod-install
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test
```

## Project Structure

```
├── App.tsx                  # App entry point
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── icons/           # SVG icon components
│   │   ├── Button.tsx
│   │   ├── Avatar.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── screens/             # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── PhoneAuthScreen.tsx
│   │   ├── ExploreScreen.tsx
│   │   └── ...
│   ├── navigation/          # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── theme/               # Design system tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── types/               # TypeScript definitions
│       └── index.ts
├── CLAUDE.md                # Claude Code documentation
└── package.json
```

## Screens

| Screen | Description |
|--------|-------------|
| Splash | App launch with animated ring logo |
| Phone Auth | Phone number authentication |
| Notification Permission | Push notification opt-in |
| Explore | Trending methods and creator groups |
| Analytics | Earnings and performance metrics |
| Ideas | Content inspiration suggestions |
| Account | Profile and settings |
| Method Stats | Detailed method earnings |
| Chat | Group messaging |

## Design System

The app uses a consistent design system with:

- **Primary Color**: `#D946EF` (Fuchsia/Pink)
- **Typography**: 8 font styles from caption to h1
- **Spacing**: 8-point grid system (4, 8, 12, 16, 20, 24, 32, 48)
- **Border Radius**: sm (8), md (12), lg (16), xl (24), full (9999)

## Current Status

This is the **UI implementation phase**. All screens and components are built with mock data. The following integrations are planned:

- Backend API integration
- Authentication (Phone/OTP)
- Real-time messaging
- Push notifications
- Payment processing
- Offline support

See [CLAUDE.md](CLAUDE.md) for detailed implementation status.

## License

Private - All rights reserved
