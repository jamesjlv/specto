# Specto — Mobile Engineering Presentation & Architecture Guide

> **Live Figma Specification**: [Specto App Design System & Screens](https://www.figma.com/design/CE4wTzrn2qTsYIOXNQtKaJ/Specto-App?node-id=0-1&m=dev)  
> **AI Pairing Session Transcript**: [Gemini Technical Pairing Session](https://share.gemini.google/6gLQRo27Cfwv)

---

## 1. Project Overview & Tooling Rationale

Specto was designed to deliver a streaming discovery experience on mid-range and low-tier Android hardware operating under unstable, high-latency network conditions. Every dependency in the stack was selected to satisfy concrete performance and hardware constraints:

| Tool / Technology                   | Architectural Purpose                  | Why Chosen Over Alternatives                                                                                                                           |
| :---------------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Expo SDK 52+ (New Architecture)** | Native runtime & engine                | Enables the Fabric renderer and TurboModules/Nitro JSI direct memory access, bypassing the legacy React Native bridge.                                 |
| **Expo Router v4**                  | Navigation & layout                    | Type-safe file-based routing that compiles routes down to native Android/iOS navigation stacks.                                                        |
| **TanStack Query v5**               | Server-state orchestration             | Built-in deduplication, automated background refetching, and rate-limit retry backoff handling.                                                        |
| **`react-native-mmkv` v3**          | Local synchronous cache & client store | Runs on Nitro Modules C++ JSI direct memory pointers. Operates **~30x faster than AsyncStorage**, enabling synchronous cold-boot hydration on frame 0. |
| **`@shopify/flash-list`**           | High-performance list virtualization   | Recycles native Android views instead of continually allocating memory on scroll, maintaining 60fps on low-RAM devices.                                |
| **`expo-image`**                    | Media pipeline                         | Delegates image decoding and bitmap caching to Android's native **Glide** engine with hardware buffer pooling to prevent Out-Of-Memory (OOM) crashes.  |
| **`nativewind` v4 (Tailwind)**      | Styling engine                         | Compiles static utility classes directly to native views at build time, eliminating runtime CSS-in-JS JavaScript thread overhead.                      |
| **`react-native-reanimated`**       | UI-thread animations                   | Runs interpolations and transitions inside the C++ Worklet runtime at 60/120fps without bridge contention.                                             |

---

## 2. Architecture: Clean Architecture + MVVM

To ensure the codebase scales cleanly as features grow, the project couples **Clean Architecture (Robert C. Martin)** with the **MVVM (Model-View-ViewModel)** pattern:

```text
┌────────────────────────────────────────────────────────┐
│ UI Layer (View)                                        │
│ React Native / NativeWind Screens & Components         │
└───────────────────────────┬────────────────────────────┘
                            │ observes / dispatches
┌───────────────────────────▼────────────────────────────┐
│ ViewModel & Presentation Layer                         │
│ Custom React Query Hooks, Zustand MMKV Stores          │
└───────────────────────────┬────────────────────────────┘
                            │ queryFn invokes
┌───────────────────────────▼────────────────────────────┐
│ Domain Layer (Use Cases & Contracts)                   │
│ IShow, IEpisode, Service Interfaces (Zero dependencies)│
└───────────────────────────┬────────────────────────────┘
                            │ implemented by
┌───────────────────────────▼────────────────────────────┐
│ Data Layer (Agnostic Implementations)                  │
│ RemoteGetShowsService, HttpClient protocol contracts   │
└───────────────────────────┬────────────────────────────┘
                            │ calls
┌───────────────────────────▼────────────────────────────┐
│ Infrastructure & Main (Composition Root)               │
│ AxiosHttpClient, MMKV Storage, Factories (API URLs)    │
└────────────────────────────────────────────────────────┘
```

### Why this architecture?

1. **Framework & Library Independence**: The core business logic (`Domain`) has zero imports from React Native, Expo, Axios, or TVMaze.
2. **Pluggable Data Sources**: The `Data` services depend purely on an abstract `HttpClient` protocol and an injected URL string. If TVMaze is replaced tomorrow with TMDB, an internal GraphQL gateway, or mock fixtures, **only the Factory layer changes**—the domain use cases, hooks, and UI screens remain 100% untouched.
3. **Isolated Testability**: Business rules and data mapping can be unit-tested in pure Node.js environments without mocking React Native native modules or bundlers.

---

## 3. How to Run Locally

### Step 1: Environment Setup

Before running the app, ensure your machine is properly configured for React Native and Expo development according to the official guide:
👉 **[Expo Official Environment Setup Documentation](https://docs.expo.dev/get-started/set-up-your-environment/)**

Ensure you have:

- **Node.js**: `v22.x`+ (LTS)
- **Git**
- **Android Studio** (for Android emulator / SDK tools) or **Xcode** (for macOS iOS Simulator)

---

### Step 2: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/jamesjlv/specto.git
cd specto

# Install project packages
npm install
```

---

### Step 3: Running on macOS

#### Run on Android:

1. Open Android Studio and launch your Android Virtual Device (AVD) or connect a physical Android device via USB with USB Debugging enabled.
2. Run:

```bash
npm run android
```

#### Run on iOS:

1. Ensure Xcode and Command Line Tools are installed.
2. Run:

```bash
npm run ios
```

---

### Step 4: Running on Windows

> _Note: Windows supports Android emulation and physical Android device development. iOS simulation requires macOS._

1. Open Android Studio, launch your configured Android Virtual Device (AVD), or plug in your physical Android phone with developer options enabled.
2. Open PowerShell or Command Prompt in the project folder and run:

```bash
# Clear Metro cache and start Android build
npx expo start -c --android
```

---

## 4. What I’d Do With More Time (Roadmap)

1. **Automated Unit & Integration Testing**:
   - Write Jest test suites for Data Layer services (`RemoteSearchShowsService`, `RemoteGetShowInfoService`) using a mocked `HttpClient` to verify HTTP status handling.
   - Implement store unit tests validating MMKV persistence and selector stability.
2. **End-to-End (E2E) Testing with Maestro**:
   - Automated user flows:
     - Onboarding intro → Genre selection → Arrival on Home.
     - Search input debouncing and query results verification.
     - Adding/removing items from "My List" across cold app restarts.
3. **CI/CD Automation (GitHub Actions + EAS)**:
   - **Continuous Integration**: Automated linting, TypeScript type-checking (`tsc --noEmit`), and unit test passes on every PR.
   - **Continuous Delivery**: Automated EAS Build pipelines building Android APKs and iOS test builds automatically on merge to `main`.
4. **Offline Mutation Queue**:
   - Build an optimistic background sync queue so bookmark toggles performed while completely offline replay to an external API upon reconnecting.
5. **Push Notifications**:
   - Using the scheduling and already known frequency, I'll schedule the push notification locally in order to let the user know that a new episode arrived.

---

## 5. AI-Usage Disclosure

In the spirit of engineering transparency, Generative AI (Google Gemini) was utilized as an interactive pair programmer during the development of this project:

- **AI Collaboration Scope**:
  - Accelerated initial boilerplate scaffolding for Clean Architecture domain contracts and data interfaces.
  - Translating exact Figma inspect styles (pixel-perfect line heights, shadow offsets, aspect ratios) into NativeWind correct classnames.
  - Generating this Readme.

---

### Author

**James Leal** — Technical Assessment for Staff Mobile Software Engineer
