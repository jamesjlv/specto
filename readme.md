# Specto — Mobile Architecture & Engineering Walkthrough

> **Live Figma Spec**: [Specto App Design System & Screens](https://www.figma.com/design/CE4wTzrn2qTsYIOXNQtKaJ/Specto-App?node-id=0-1&m=dev)
> **AI Pairing Session Transcript**: [Gemini Technical Pairing Session](https://share.gemini.google/6gLQRo27Cfwv)

---

## 1. Project Overview & Stack Choices

I built Specto to deliver a smooth, responsive streaming discovery experience—especially on everyday and lower-end Android phones that often struggle with heavy media apps and spotty connections.

Here is why I picked each tool for the job:

| Tool / Library                      | Role                    | Why I Chose It                                                                                                                                                    |
| ----------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Expo SDK 52+ (New Architecture)** | Native runtime          | Runs on React Native’s modern Fabric engine and TurboModules, giving us direct C++ memory access and skipping old bridge lag.                                     |
| **Expo Router v4**                  | Navigation              | Simple file-based routing that stays fully type-safe and maps directly to native navigation stacks on iOS and Android.                                            |
| **TanStack Query v5**               | Server state & cache    | Automatically handles caching, request deduplication, background refreshes, and API retry logic out of the box.                                                   |
| **`react-native-mmkv` v3**          | Local storage           | Blazing fast synchronous storage (around 30x faster than AsyncStorage). It lets the app hydrate bookmarks and user state immediately on launch with zero flicker. |
| **`@shopify/flash-list`**           | List virtualization     | Recycles native Android views on the fly rather than keeping hundreds of views in memory, keeping scrolling at a smooth 60fps.                                    |
| **`expo-image`**                    | Image caching & loading | Offloads heavy image decoding and caching to native engines (like Glide on Android) to prevent memory spikes and out-of-memory crashes.                           |
| **`nativewind` v4 (Tailwind)**      | Styling                 | Gives you Tailwind utility classes compiled ahead-of-time into native views, so there is no runtime styling penalty in JavaScript.                                |
| **`react-native-reanimated`**       | Animations              | Runs smooth transitions and layout changes directly on the UI thread without freezing the JavaScript thread.                                                      |

---

## 2. Architecture: Clean Architecture + MVVM

To keep the project organized and maintainable as it grows, I separated concerns using a clean layered approach:

```text
┌────────────────────────────────────────────────────────┐
│ UI Layer (View)                                        │
│ React Native screens, reusable widgets & NativeWind    │
└───────────────────────────┬────────────────────────────┘
                            │ observes / dispatches
┌───────────────────────────▼────────────────────────────┐
│ ViewModel Layer                                        │
│ Custom React Query hooks, Zustand stores, MMKV state   │
└───────────────────────────┬────────────────────────────┘
                            │ calls
┌───────────────────────────▼────────────────────────────┐
│ Domain Layer (Business Logic)                          │
│ Show/Episode interfaces, contracts (zero dependencies) │
└───────────────────────────┬────────────────────────────┘
                            │ implemented by
┌───────────────────────────▼────────────────────────────┐
│ Data Layer                                             │
│ API services, HTTP client protocols, data mappers      │
└───────────────────────────┬────────────────────────────┘
                            │ configured in
┌───────────────────────────▼────────────────────────────┐
│ Infrastructure / Root                                  │
│ Axios HTTP client, storage instances, API factories    │
└────────────────────────────────────────────────────────┘

```

### Why this setup works well:

- **Independent business logic**: The domain layer doesn't know or care about React Native, Expo, or TVMaze.
- **Easy API swaps**: If we ever change our data provider from TVMaze to TMDB or an internal GraphQL API, we only touch the Data/Factory layer. The UI screens, custom hooks, and domain models stay untouched.
- **Stress-free testing**: We can write unit tests for data logic in plain Node.js without needing complex native mocks.

---

## 3. How to Run Locally

### Prerequisites

Make sure your machine is set up for Expo development by following the [Expo Environment Setup Guide](https://docs.expo.dev/get-started/set-up-your-environment/).

You will need:

- **Node.js**: `v22.x`+ (LTS)
- **Android Studio** (for the Android emulator) or **Xcode** (macOS, for the iOS Simulator)

---

### Setup & Install

```bash
# Clone the repository
git clone https://github.com/jamesjlv/specto.git
cd specto

# Install project packages
npm install

```

---

### Running the App

#### On Android (macOS / Windows / Linux)

1. Start an Android Virtual Device (AVD) from Android Studio, or connect a physical phone with USB Debugging turned on.
2. Start the dev server:

```bash
npm run android

```

_(On Windows, you can also run `npx expo start -c --android` to clear the cache)._

#### On iOS (macOS only)

1. Launch the iOS Simulator through Xcode.
2. Run:

```bash
npm run ios

```

---

## 4. Next Steps & What I'm Shipping Next

Due to time constraints during this build sprint, I prioritized getting the core architecture and critical browsing flows rock solid. Here is the immediate roadmap I am rolling out next:

### 1. Episode Release Push Notifications

- Schedule local notifications for favorited shows using the TVMaze broadcast schedule.
- Alert users right when a new episode drops so they never miss a release.

### 2. End-to-End Testing with Maestro

- Write automated UI flows in Maestro to cover real-world journeys:
- Onboarding flow → Genre selection → Arriving on Home.
- Search debouncing and result rendering.
- Adding and removing shows from "Favorites" with persistent state verification across cold app restarts.

### 3. Personalized Show Suggestions

- Build a recommendation feed based on the user's saved favorites and individual genre picks (treating each genre distinctly without mixing categories).
- Surfaces new titles that match their viewing tastes directly on the discovery screen.

### 4. Full NativeWind Migration (Styling Debt Cleanup)

- Sweep through screens where quick inline styles were added during rapid prototyping.
- Migrate all remaining styles to pure NativeWind utility classes to keep styling unified, clean, and zero-runtime.

### 5. Screen Refactoring into Reusable Components

- Break down monolithic screen files into small, focused subcomponents (cards, badges, header bars, action sheets).
- Improves code readability, makes atomic testing easier, and speeds up future screen builds.

### 6. Automated CI/CD & App Store Delivery

- **GitHub Actions**: Run automated TypeScript checks (`tsc --noEmit`), ESLint, and unit test suites on every pull request.
- **EAS Build & Deploy**: Set up automated EAS pipelines to trigger production APK/AAB builds for Google Play and internal TestFlight distributions on merges to `main`.

### 7. Performance Benchmarks on Local Data

- Profile MMKV read/write latencies under large offline payloads (1,000+ cached items).
- Monitor memory consumption and frame rate consistency during aggressive scrolling on budget test devices to guarantee no dropped frames.

---

## 5. AI Collaboration Transparency

In the spirit of engineering transparency, I used Google Gemini as an interactive pairing partner during this build:

- **Where it helped**:
- Scaffolding initial Clean Architecture domain interfaces and boilerplate data structures.
- Speeding up translation of Figma design specifications (exact spacing, line heights, aspect ratios) into NativeWind classes.
- Drafting initial structure for this documentation.

---

### Author

**James Leal** — Senior Mobile Software Engineer
