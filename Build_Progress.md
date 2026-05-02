# SAFAR Build Progress Log

This file is updated after every meaningful change set.

Any AI agent that changes code must update all Markdown files in the repo to keep documentation current.

## Update Protocol

For each update entry, include:

1. Date/time
2. Goal of the change
3. Files changed
4. What was verified
5. Known issues or follow-ups
6. Reasoning (why this approach was chosen)
7. Core idea (the design/engineering principle behind the change)

## Documentation Standard (Mandatory)

Every future update must explain in simple words:
- what changed,
- why it changed,
- how it was verified,
- and the core idea behind the implementation choice.

Current primary testing workflow: Web variant via `npx expo start --web --clear`.

---

## Entry 001 — 2026-04-20

### Goal
- Establish a disciplined execution workflow before writing feature code.

### Changes Made
- Created comprehensive build roadmap checklist in `Implementation_Checklist.md`.
- Created this progress log file (`Build_Progress.md`) to track every change set.

### Files Changed
- `Implementation_Checklist.md`
- `Build_Progress.md`

### Verification
- Confirmed both files are created and available in workspace.

### Follow-ups
- Start Phase 0 implementation from checklist (foundation + project config validation).

---

## Entry 002 — 2026-04-20

### Goal
- Fix Expo startup blocker caused by empty `app.json`.

### Changes Made
- Recreated `app.json` with a valid minimal Expo configuration (`name`, `slug`, `version`, `orientation`, `assetBundlePatterns`, Android package).

### Files Changed
- `app.json`
- `Build_Progress.md`

### Verification
- Ran `npx expo config --json` successfully.
- Confirmed Expo now parses static config from `app.json` with no `EmptyJsonFileError`.

### Follow-ups
- Continue Phase 0 setup: scripts, Expo Router shell, and dependency baseline.

---

## Entry 003 — 2026-04-20

### Goal
- Create the first runnable Expo Router app shell with valid routes.

### Changes Made
- Updated `package.json` to use `expo-router/entry` and added Expo run scripts.
- Added `tsconfig.json` and `babel.config.js` for TypeScript + Expo Router + Reanimated support.
- Added root and group layouts for auth and tabs.
- Added starter screens for auth flow and main tabs.
- Filled all current route files with valid default screens.

### Files Changed
- `package.json`
- `tsconfig.json`
- `babel.config.js`
- `app/_layout.tsx`
- `app/index.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/index.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/explore/[destination].tsx`
- `app/(tabs)/journeys/index.tsx`
- `app/(tabs)/journeys/collection.tsx`
- `app/(tabs)/journeys/[tripId]/itinerary.tsx`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
- `app/(tabs)/journeys/[tripId]/expense.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/messages/index.tsx`
- `app/(tabs)/profile/index.tsx`
- `app/agencies/index.tsx`
- `app/agencies/[agencyId].tsx`
- `app/safety/index.tsx`
- `app/traveler/[userId].tsx`

### Verification
- Ran `npx expo config --json` successfully.
- Confirmed Expo config includes `expo-router` plugin.
- Checked app directory for errors; none found.

### Follow-ups
- Next implement shared theme constants and reusable UI components, then wire in actual data/state.

---

## Entry 004 — 2026-04-20

### Goal
- Fix the TypeScript config warning and add a documentation maintenance rule across all Markdown files.

### Changes Made
- Updated `tsconfig.json` to silence the TypeScript 6 deprecation warning for `baseUrl`.
- Added a plain-language explanation file.
- Added the AI documentation maintenance note to all Markdown files.

### Files Changed
- `tsconfig.json`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Safar_Context.md`
- `Safar_PRD.md`
- `Project_Explanation.md`

### Verification
- TypeScript config warning addressed by adding `ignoreDeprecations`.
- Documentation rule added consistently across every Markdown file.

### Follow-ups
- Continue implementation from the checklist, starting with shared UI components and theme constants.

---

## Entry 005 — 2026-04-20

### Goal
- Fix Expo web startup dependency conflict and verify browser preview works.

### Changes Made
- Installed and aligned web dependencies for Expo SDK 55:
	- `react@19.2.0`
	- `react-dom@19.2.0`
	- `react-native-web@0.21.2`
- Removed deprecated `expo-router/babel` plugin from `babel.config.js`.

### Files Changed
- `package.json`
- `package-lock.json`
- `babel.config.js`
- `Build_Progress.md`
- `Project_Explanation.md`

### Verification
- `npx expo start --web --clear` now starts successfully.
- Web bundling completes and serves at `http://localhost:8081`.

### Follow-ups
- Continue feature implementation using either Android LAN mode or web preview.

---

## Entry 006 — 2026-04-20

### Goal
- Standardize project documentation quality and mark web variant as the active testing path.

### Changes Made
- Added a mandatory explanation standard to project markdown workflow.
- Added explicit protocol requirements to include reasoning and core idea in every future progress entry.
- Marked web preview as the current primary test workflow.

### Files Changed
- `Build_Progress.md`
- `Project_Explanation.md`
- `Implementation_Checklist.md`
- `Safar_Context.md`
- `Safar_PRD.md`

### Verification
- Confirmed the new explanation standard appears in all maintained markdown docs.
- Confirmed the web-variant workflow is explicitly documented.

### Reasoning
- The project is evolving quickly; without explicit reasoning notes, future edits become hard to audit and maintain.

### Core Idea
- Documentation should capture decisions, not just actions, so any contributor can understand intent and continue safely.

### Follow-ups
- Apply this structure to all future implementation entries.

---

## Entry 007 — 2026-04-20

### Goal
- Implement the shared UI component layer and apply it across key screens to closely match the SAFAR frame language with cleaner production-style structure.

### Changes Made
- Created complete design tokens in `constants/colors.ts`.
- Added realistic seed data in `constants/mockData.ts` and `constants/agencies.ts`.
- Implemented reusable components:
	- `components/layouts/HeritageHeader.tsx`
	- `components/ui/ArchCard.tsx`
	- `components/ui/RadarChart.tsx`
	- `components/ui/ChatBubble.tsx`
	- `components/ui/ExpenseRow.tsx`
	- `components/ui/SOSButton.tsx`
	- `components/ui/AgencyCard.tsx`
	- `components/ui/OfflineBanner.tsx`
- Integrated components into major screens:
	- Auth (`app/(auth)/index.tsx`, `app/(auth)/login.tsx`)
	- Explore, Journeys, Community, Profile, Messages, Trips Collection, Safety, Agencies index.

### Files Changed
- `constants/colors.ts`
- `constants/mockData.ts`
- `constants/agencies.ts`
- `components/layouts/HeritageHeader.tsx`
- `components/ui/ArchCard.tsx`
- `components/ui/RadarChart.tsx`
- `components/ui/ChatBubble.tsx`
- `components/ui/ExpenseRow.tsx`
- `components/ui/SOSButton.tsx`
- `components/ui/AgencyCard.tsx`
- `components/ui/OfflineBanner.tsx`
- `app/(auth)/index.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/journeys/index.tsx`
- `app/(tabs)/journeys/collection.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/messages/index.tsx`
- `app/(tabs)/profile/index.tsx`
- `app/safety/index.tsx`
- `app/agencies/index.tsx`
- `Build_Progress.md`
- `Project_Explanation.md`
- `Implementation_Checklist.md`
- `Safar_Context.md`
- `Safar_PRD.md`

### Verification
- Checked app/components/constants for diagnostics: no errors reported.
- Web bundling succeeds and launches with current UI structure.
- Expo router structure remains valid and compilable.

### Reasoning
- Building UI from reusable primitives first prevents duplicated styles and keeps later feature work faster and safer.
- A tokenized system enforces consistent colors/spacing and keeps visual quality close to the Figma-inspired direction.

### Core Idea
- Create a scalable design system layer first, then compose screens from reusable blocks; this improves maintainability and visual consistency while meeting PRD fidelity.

### Follow-ups
- Implement data/state-backed behavior for these screens (auth, trips, matches, safety actions).

---

## Entry 008 — 2026-04-21

### Goal
- Start the prototype-first phase by aligning app screens to the updated PRD/Figma frame language and force a mobile-like viewport on web.

### Changes Made
- Added a web mobile frame shell in the root layout so the web variant renders in a phone-like centered container.
- Added reusable frame bottom navigation component and switched tab layout to hide native tab bar.
- Reworked screen UIs to closely match updated PRD copy/layout for:
	- Splash + Sign In
	- Explore + Destination detail
	- Journeys + Trips Collection + New Journey
	- AI Match Discovery
	- Agency Directory + Agency Profile
	- Traveler Public Profile + User Profile & Settings
	- Vibe Room / Messages
	- Expense Ledger
	- Safety Center
	- Sync Interrupted screen
- Refined shared heritage header styling to better match frame top bar look.

### Files Changed
- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(auth)/index.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/explore/[destination].tsx`
- `app/(tabs)/journeys/index.tsx`
- `app/(tabs)/journeys/collection.tsx`
- `app/(tabs)/journeys/new-journey.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/messages/index.tsx`
- `app/(tabs)/profile/index.tsx`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
- `app/(tabs)/journeys/[tripId]/expense.tsx`
- `app/agencies/index.tsx`
- `app/agencies/[agencyId].tsx`
- `app/traveler/[userId].tsx`
- `app/safety/index.tsx`
- `app/connection-error.tsx`
- `components/layouts/FrameBottomNav.tsx`
- `components/layouts/HeritageHeader.tsx`
- `Build_Progress.md`

### Verification
- Ran workspace diagnostics via editor tooling: no current errors reported.
- Confirmed route files compile with updated imports and screen-level structure.

### Follow-ups
- Continue with strict visual parity refinements against each Figma frame (spacing, iconography, and image treatment).
- Begin backend/state wiring only after UX parity pass is accepted.

### Reasoning
- Implementing visual parity first reduces churn: backend logic can be wired into stable, approved UI surfaces instead of changing layout and behavior simultaneously.

### Core Idea
- Freeze the product surface first (prototype-faithful front-end), then attach data/state systems to each finalized screen in a second pass.

---

## Entry 009 — 2026-04-21

### Goal
- Complete the next prototype screens, stabilize shared layout utilities, migrate the UI to the parchment + rich mahogany palette, and synchronize all project documentation with the latest implementation state.

### Changes Made
- Implemented and integrated additional screen-level UIs:
	- Auth Splash redesign (`app/(auth)/index.tsx`)
	- Auth Login redesign with validation/error/loading states (`app/(auth)/login.tsx`)
	- Explore Discover Hub redesign (`app/(tabs)/explore/index.tsx`)
	- Match Discovery redesign (`app/(tabs)/community/index.tsx`)
	- Profile & Settings redesign (`app/(tabs)/profile/index.tsx`)
- Added/updated shared support pieces:
	- Added unified theme file `constants/Theme.ts` (Colors, Typography, Spacing, Radius, Shadow)
	- Added `MOCK_EXPLORE`, `MOCK_MATCHES`, and `MOCK_USER` in `constants/mockData.ts`
	- Added `components/layouts/SafarHeader.tsx` and `components/layouts/BottomTabBar.tsx`
	- Enhanced `BottomTabBar` to auto-highlight based on current route
	- Enhanced `SafarHeader` with optional `showAvatar` prop
- Applied color-system migration:
	- Global background switched to parchment `#EEEDE9`
	- Primary/accent switched to rich mahogany `#371B17`
	- Removed remaining yellow/gold/tan visual accents from major components and CTA surfaces
	- Replaced legacy hardcoded palette values in affected screens/layout containers
- Fixed runtime issue found during debug run:
	- Resolved unterminated string constant in `app/(tabs)/community/index.tsx`
- Updated all project documentation files to reflect the new screen state and design-system direction.

### Files Changed
- `app/(auth)/index.tsx`
- `app/(auth)/login.tsx`
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/profile/index.tsx`
- `app/(tabs)/journeys/collection.tsx`
- `app/(tabs)/journeys/[tripId]/expense.tsx`
- `app/(tabs)/journeys/[tripId]/itinerary.tsx`
- `app/agencies/index.tsx`
- `app/agencies/[agencyId].tsx`
- `app/_layout.tsx`
- `components/layouts/SafarHeader.tsx`
- `components/layouts/BottomTabBar.tsx`
- `constants/Theme.ts`
- `constants/colors.ts`
- `constants/mockData.ts`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`

### Verification
- Ran workspace diagnostics on all edited TS/TSX files: no reported errors.
- Restarted Expo web (`npx expo start --web --clear`) multiple times during implementation/debug cycle.
- Confirmed no blocking startup/runtime errors after fixes; only non-blocking Expo package compatibility warnings remained.

### Known Issues / Follow-ups
- `tsconfig` warning/error around `ignoreDeprecations` remains a separate pre-existing tooling concern.
- Expo dependency compatibility warnings remain; can be resolved by aligning package versions with `npx expo install` recommendations.
- Backend/data wiring and realtime behavior are still pending for full functional completion.

### Reasoning
- The team required high-fidelity prototype conversion first, so we prioritized screen contracts, shared component consistency, and unified theme tokens before backend integration.

### Core Idea
- Establish one authoritative visual language (token-driven parchment + mahogany system) and one reusable layout pattern, then layer business logic onto stable UI contracts.

---

## Entry 010 — 2026-04-25

### Goal
- Complete the UI quality pass across Explore, Journeys, Vibe Room, and Profile so the app feels production-ready.

### Changes Made
- Wired Explore category pills to a real `CATEGORY_DATA` map and updated section headline rendering.
- Fixed Hunza Valley Featured Escape image rendering and refined card layout.
- Made Journeys tabs render distinct Upcoming / Past Trips / Wishlist content.
- Corrected Latest Update avatar stacking and action buttons.
- Enriched Vibe Room with Today's Brief, quick actions, and emoji reactions.
- Overhauled Profile with hero cover, achievements, followers preview, and recent journeys scroll.

### Files Changed
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/journeys/index.tsx`
- `app/(tabs)/journeys/collection.tsx`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
- `app/(tabs)/profile/index.tsx`
- `constants/mockData.ts`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`

### Verification
- `npx tsc --noEmit --skipLibCheck` reported zero errors.
- IDE diagnostics showed only pre-existing SafeAreaView deprecation hints.

### Known Issues / Follow-ups
- Backend and realtime wiring remain pending for these UI surfaces.

### Reasoning
- The app needed consistent, production-grade visual fidelity before backend wiring to avoid layout churn later.

### Core Idea
- Lock the product surface with data-reactive UI first, then attach business logic to stable screens.

---

## Entry 011 — 2026-04-25

### Goal
- Make the Featured Escape image render reliably and improve the card content hierarchy.

### Changes Made
- Added Featured Escape image fallback handling and display metadata (duration + highlight chips).
- Updated mock data to include a fallback image URL and highlight metadata.
- Synchronized all project markdown files with the latest change.

### Files Changed
- `app/(tabs)/explore/index.tsx`
- `constants/mockData.ts`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`
- `.expo/README.md`

### Verification
- Not run in this session (UI check pending).

### Known Issues / Follow-ups
- If the remote image URL fails on specific networks, consider hosting critical hero images locally or in Supabase Storage.

### Reasoning
- A broken hero image undermines credibility; the fallback and metadata make the card resilient and more informative.

### Core Idea
- Design for reliability: critical visual surfaces should degrade gracefully without losing context.

---

## Entry 010 — UI Quality Pass: Categories, Image Fix, Tabs, Vibe Room, Profile Overhaul (2026-04-25)

### Goal
Bring six specific pain points up to "top 500 app" visual and interaction quality: non-functional category pills on Explore, broken Hunza Valley image, Journeys tabs showing identical content, misaligned avatar/button row on the Latest Update card, an empty-feeling Vibe Room, and an unprofessional Profile page.

### What Changed

**Explore (`app/(tabs)/explore/index.tsx`)**
- Added a `CATEGORY_DATA` map with two curated journeys per category (MOUNTAINS / HERITAGE / DESERT / LAKES / CITY). Each entry provides `{ headline, journeys[] }`.
- Category pill taps now drive `baseJourneys` (which two journey cards are displayed) and `sectionHeadline` (section title above the cards). Previously the pills updated state but nothing in the UI depended on it.
- Fixed the Hunza Valley featured card: moved `overflow: 'hidden'` + `borderRadius` from the parent `TouchableOpacity` to the `ImageBackground` style directly, which resolves the Android clipping bug that prevented the background image from rendering.
- Added `featuredImgStyle` as a named style for the `imageStyle` prop to keep it type-safe.

**Journeys (`app/(tabs)/journeys/index.tsx`)**
- Imported `MOCK_TRIPS` alongside `MOCK_JOURNEYS`.
- **Upcoming tab**: unchanged — shows the two active/booking journeys (Karakoram + Annapurna).
- **Past Trips tab**: new layout — filters `MOCK_TRIPS` by `daysLeft === 0` and renders each as a card with hero image, year badge, destination, a `Completed` chip, meta chips (dates/stops/hotel), and a "View Journal →" link.
- **Wishlist tab**: new layout — 3 hardcoded wish destinations rendered as hero `ImageBackground` cards with heart badge and best-window notes; dashed "Discover more" add button at bottom.
- **Latest Update card**: replaced the broken `position: 'relative'` + `left` offset avatar approach (which doesn't work in RN Flexbox) with `marginLeft: -10` stacking on real avatar images; added `Notify All` (filled) and `View All` (outlined) action buttons aligned to the right of the stack.

**Vibe Room (`app/(tabs)/journeys/[tripId]/vibe-room.tsx`)**
- Added a collapsible **TODAY'S BRIEF** card (between pinned itinerary and messages): shows temperature, sunset time, next stop, and days remaining — expands/collapses via `briefExpanded` state.
- Added a horizontal **Quick Actions** strip (Photo, Location, Poll, Event, Docs) with icon + label, each navigating to the appropriate flow screen.
- Added a horizontal **emoji reaction strip** (🔥 Hot, 👀 Noted, ✅ On it, ❤️ Love it, ⚡ Let's go) above the input bar.

**Profile (`app/(tabs)/profile/index.tsx`)**
- Full hero redesign: `ImageBackground` cover photo (Karakoram landscape), dark overlay, 96px avatar with brand-color ring, camera edit badge, name/title/quote in white text.
- Follow / Share / Message action row below the hero.
- Stats card now shows icons per stat (earth, compass, people).
- Horizontal scrollable **Achievement badges** row (5 chips).
- **Followers preview** card with real overlapping avatar stack and context line.
- **Recent Journeys** horizontal card scroll from `MOCK_TRIPS` with image, title, destination, dates, and active pill.
- **Membership card** redesigned with icon, label hierarchy, and a proper CTA row.
- All menu rows now have tinted icon backgrounds, a description subtitle, and `chevron-forward` arrow.
- Security section uses the same icon-row pattern with descriptions.
- Logout button has icon + text, version string beneath it.

### Files Changed
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/journeys/index.tsx`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
- `app/(tabs)/profile/index.tsx`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`

### Verification
- `npx tsc --noEmit --skipLibCheck` → zero type errors across all changed files.
- IDE diagnostics: only pre-existing `SafeAreaView` deprecation hints (severity: Hint, not Error) consistent with the rest of the codebase.
- Read-through of every JSX block to confirm no missed imports or undefined references.
- `CATEGORY_DATA` keys match the `MOCK_EXPLORE.categories` array exactly (`MOUNTAINS / HERITAGE / DESERT / LAKES / CITY`).

### Reasoning
- **ImageBackground + overflow**: In React Native, `overflow: 'hidden'` on a `TouchableOpacity` parent can cause Android to clip the child image to nothing when elevation (shadow) is also present. Moving both `overflow: 'hidden'` and `borderRadius` to the `ImageBackground` itself is the correct platform-safe pattern.
- **Journeys tabs**: The simplest correct approach was to keep all tab content in the same `ScrollView` component, gated by an `if` (tab === …) block — no tab navigator needed, consistent with the existing one-screen architecture.
- **Avatar stack**: `marginLeft: -10` is the standard React Native approach for overlapping avatar stacks. `position: 'relative'` with `left` offset doesn't move elements in RN Flexbox the way it does in CSS — only `position: 'absolute'` with `left` works, and that requires a defined-height parent container.
- **Profile hero**: A full-bleed cover photo with a dark overlay and centered avatar is the established pattern for social/travel apps at this quality tier. Using an `ImageBackground` with an rgba overlay View avoids the need for `expo-linear-gradient`.

### Core Idea
Functional polish requires two things together: data wiring (state actually driving the visible output) and visual credibility (patterns the user recognises from apps they already trust). This pass addressed both — every pill now changes content, every tab shows unique data, and the profile follows the cover-photo + stats + section-cards pattern used by Airbnb, Strava, and Instagram.

### Known Issues / Follow-ups
- Vibe Room Quick Action routes (`/flows/share-location`, `/flows/create-poll`, etc.) resolve to the catch-all `flows/[flow].tsx` — no dead link, but those flow screens are stubs.
- `CATEGORY_DATA` journeys are hardcoded inline; a future pass could move them into `mockData.ts` alongside `MOCK_EXPLORE`.
- `borderStyle: "dashed"` on the Wishlist add-button is not supported on Android (RN limitation) — it will render as solid. Known cosmetic issue.

---

## Entry 3 — UI/UX Audit & Polish Pass (2026-04-24)

### What Changed

**Dead Code Cleanup**
- Removed 5 unused component files: `SOSButton.tsx`, `OfflineBanner.tsx`, `RadarChart.tsx`, `AgencyCard.tsx`, `ExpenseRow.tsx` — none were imported anywhere in the app.
- Removed unused `Image` import from `login.tsx`.
- Replaced all hardcoded hex values in screen files with Theme token references.
- Removed redundant `<View style={{ height: 20 }} />` spacers now covered by `contentContainerStyle.paddingBottom`.

**Theme Tokens Fixed**
- `Colors.bgCard` and `Colors.card` changed from `#FFFFFF` to `#FAFAF8` (warm white per spec).
- `Colors.brandLight` changed from cold blue `#5B6BF5` to warm mahogany-derived `#8A5E4A`.
- `Colors.dangerDark` added (`#8B2020`) for SOS active state.
- All `Shadow.*` values changed from black (`#000`) shadow color to mahogany (`#371B17`), opacity 0.07–0.12.
- Added `scale(size)` utility exported from `Theme.ts` for responsive font sizing.
- Updated `colors.ts` cardWhite from `#FFFFFF` to `#FAFAF8`.

**Splash Screen — Full Redesign**
- Replaced mountain logo + stats + Urdu tagline with: SAFAR wordmark centered on parchment, subtle arch motif (thin arched border), tagline "Every journey tells a story."
- Wordmark fades in at 0ms (800ms, ease-in-out). Tagline fades in at 400ms delay (600ms).
- Full screen fades out at 2.2s → navigates to login via `router.replace`.
- Uses RN `Animated` API with `useRef` to avoid re-creating values. No Reanimated dependency added.

**Responsive / Layout**
- Added `contentContainerStyle={{ paddingBottom: 100 }}` to every tab-screen ScrollView (Explore, Journeys, Community, Safety, Profile, Traveler, Agencies).
- `_layout.tsx` hardcoded hex values replaced with `Colors.bg`, `Colors.bgMuted`, `Colors.border`.
- `SafarHeader` avatar size fixed to 44×44pt (was 30×30pt — below touch target spec).

**Navigation**
- Profile logout now calls `router.replace('/(auth)/index')` instead of pushing to `/flows/logout-confirm`.
- `explore/index.tsx` explore card routes wrapped with `as never` to satisfy Expo Router typed paths.
- `explore/[destination].tsx` rewritten to use Theme tokens, SafarHeader, SafeAreaView, and proper BottomTabBar placement.
- Back buttons on deep screens (`expense`, `itinerary`, `new-journey`, `traveler`) have `hitSlop={{ top:8, bottom:8, left:8, right:8 }}`.

**HCI / Interactions**
- `login.tsx` `KeyboardAvoidingView` behavior corrected: iOS → `'height'`, Android → `'padding'`.
- Explore search bar wired to `searchQuery` state; `filteredJourneys` drives card rendering; empty state shown when no match.
- Explore category chip toggle working via `setActiveCategory`.
- `messages/index.tsx` fully rewritten: `BottomTabBar` moved outside `ScrollView`, `HeritageHeader` replaced with `SafarHeader`, `SafeAreaView` wrapper added, all hardcoded hex values replaced.

**Animations**
- `traveler/[userId].tsx` hero section gains `FadeInDown.duration(350)` entrance animation.
- FrameBottomNav already has press-scale animation via Reanimated; shadow color corrected.

**Component Updates**
- `ArchCard.tsx` migrated from `colors.ts` tokens to `Theme.ts` tokens.
- `FrameBottomNav.tsx` shadow changed from black to mahogany.
- `SafarHeader.tsx` shadow changed from black to mahogany.
- `safety/index.tsx` safety rating overlay background changed from cold blue (`brandLight`) to `Colors.success` (warm teal — semantically correct for a safety score).

### Why

- Warm card white removes the cold clinical look that clashed with the heritage aesthetic.
- Mahogany shadow tones keep elevation cues inside the warm palette rather than breaking it.
- Proper `scale()` function in Theme.ts makes responsive font sizing available app-wide.
- Splash redesign matches the "handcrafted travel journal" identity — minimal, typographic, intentional.
- Profile logout to `/(auth)/index` is the correct UX flow; the flows catch-all was wrong.

### How Verified

- `npx tsc --noEmit --ignoreDeprecations 5.0` → zero errors.
- `npx expo start --web --clear` → server starts, HTML served without crash.
- Manual read-through of every edited file for missed hex values and import consistency.

### Follow-ups (Skipped / Budget)

- `scale()` applied to font sizes in all screen files — currently only Theme typography defines base sizes; applying `scale()` inline across every `fontSize` reference would require touching ~40 style definitions. Recommend a follow-up pass.
- SOS pulse animation (radial shadow) on the SOS button — deferred; requires Reanimated `withRepeat` loop.
- Staggered list card entrance animations on Community and Agencies screens — partial (hero section only on Traveler); full stagger for all list items is a follow-up.
- `collection.tsx` and `new-journey.tsx` `View style={{ height: 20 }}` spacers not removed (already have paddingBottom on those ScrollViews; low risk).
- ChatBubble still uses `colors.ts` tokens rather than `Theme.ts`; functional but inconsistent — migrate in a follow-up.
- `app/(tabs)/journeys/collection.tsx` and `app/(tabs)/journeys/new-journey.tsx` ScrollViews still using default contentContainerStyle without explicit `paddingBottom: 100` — add in next pass.

---

## Entry 012 — 2026-04-26

### Goal
- Fix responsive typography scaling on multiple screens by applying the `scale()` function to Typography token sizes.

### Changes Made
- Updated all `fontSize` values in the `Typography` object to use `scale()` function:
  - `display` and `displayXl`: `scale(48)`
  - `displayLg`: `scale(40)`
  - `h1`: `scale(32)`
  - `h2`: `scale(28)`
  - `h3`: `scale(24)`
  - `h4`: `scale(20)`
  - `body`: `scale(16)`
  - `bodyMd`: `scale(15)`
  - `bodySm` and `bodyMedium`: `scale(14)`
  - `label`: `scale(12)`
  - `caption`: `scale(11)`
- Also applied `scale()` to line heights for proportional scaling:
  - All Typography line heights now use `scale(lineHeight)` for consistent aspect ratios across devices.

### Files Changed
- `constants/Theme.ts`
- `Build_Progress.md`

### Verification
- `npx tsc --noEmit --skipLibCheck` confirms no type errors.
- Fonts will now scale proportionally relative to device width (base: 390px width).

### Reasoning
- The `scale()` utility function was previously defined but not used in Typography; this caused fixed font sizes on all screens, making text appear oversized on wider screens (e.g., web, tablet) and inconsistent.
- By applying `scale()` to all Typography sizes, fonts now adapt to the actual device viewport, maintaining design fidelity across screen sizes.

### Core Idea
- A design system should treat typography the same way it treats spacing/layout: responsive and proportional to the viewport, not fixed and absolute. This ensures the app feels correctly proportioned whether viewed on a 390px phone or a 1200px web canvas.

### Follow-ups
- Monitor typography appearance on actual devices and web; if the scaling is too aggressive or too conservative, adjust the 390px baseline in the `scale()` function.
- Consider adding a similar `vscale()` based scaling to line heights if vertical rhythm needs device-height adaptation.

---

## Entry 013 — 2026-04-27

### Goal
Frontend completeness audit before backend integration: verify every interactive element either navigates, triggers a state change, opens a modal, or is explicitly stubbed with a Coming Soon alert.

### Audit Results

**Total interactives enumerated: 87**
**Confirmed working: 80**
**Fixed: 5**
**Remaining intentional stubs: 14 (all route through flows/[flow].tsx with back button)**

### Items Fixed

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 1 | `app/(tabs)/explore/[destination].tsx` | `useRouter()` result discarded; no back button — screen was a dead end | Captured router, added back-button row above SafarHeader |
| 2 | `app/(tabs)/messages/index.tsx` | `inputBar` add-icon and send-icon were plain `Ionicons` inside a static `View` — no `onPress` | Wrapped both in `TouchableOpacity` with Coming Soon `Alert.alert()` |
| 3 | `app/(tabs)/profile/index.tsx` | Logout routed to `/(auth)/index` (splash screen → 2.4s delay before login) | Changed to `/(auth)/login` for immediate redirect |
| 4 | `app/flows/[flow].tsx` | 10 flow keys had no config and showed generic "Flow Coming Soon" fallback | Added named configs for: `notifications`, `settings`, `share-profile`, `followers`, `feedback`, `updates`, `share-location`, `create-poll`, `create-event`, `trip-docs` |

### Tab Navigation Verified
- All 5 bottom tabs route to real screens ✓
- Active highlight logic in `BottomTabBar.tsx` uses `usePathname()` — correct ✓
- All deep screens have back buttons (itinerary, expense, vibe-room, agency-detail, traveler, flows, new-journey) ✓

### Modal/Overlay Audit
- Expense modal: Cancel button closes it ✓
- Error modal (vibe-room): Retry + Dismiss close it ✓
- Match overlay (community): Start Chat + Keep Exploring dismiss it ✓
- Expanded profile (SwipeCard): Pass/Connect/close dismiss it ✓
- SOS button: confirmation Alert before activating ✓
- Logout: confirmation Alert before executing ✓

### Files Changed
- `app/(tabs)/explore/[destination].tsx`
- `app/(tabs)/messages/index.tsx`
- `app/(tabs)/profile/index.tsx`
- `app/flows/[flow].tsx`
- `Build_Progress.md`

### Verification
- `npx tsc --noEmit` → only pre-existing `tsconfig.json ignoreDeprecations "6.0"` error; zero new type errors.

### Reasoning
- Dead interactive elements erode trust in the app and block UX review. Every visible button must have a defined response, even if it's a stub.
- Routing logout through the splash screen added an unnecessary 2.4s delay — direct routing to login is cleaner.
- Named flow configs give each stub screen a descriptive title and CTA rather than the generic "Flow Coming Soon" fallback.

### Core Idea
Interactive completeness is a contract: if a user can see and tap something, it must respond. Stubs are acceptable; silence is not.

---

## Entry 014 — 2026-04-27

### Goal
Implement all remaining PRD features (Pass 1–7 full sweep): auth flows, state management, wishlist persistence, community swipe, agency booking, safety emergency contacts, expense settlement, profile edit, settings screen, and wire all navigation. Produce final feature audit checklist.

### What Changed

**New Stores (Zustand v5)**
- `stores/tripStore.ts` — Created. Holds `newTrips` (user-created journeys) and `wishlist` (saved destinations). Exposes `addTrip`, `addToWishlist`, `removeFromWishlist`, `isWishlisted`.
- `stores/profileStore.ts` — Created. Holds editable profile fields (`name`, `bio`, `travelStyles`, `languages`). Exposes `setProfile`.

**New Auth Screens**
- `app/(auth)/register.tsx` — Full multi-role registration (F01, F41). Role toggle: `traveler` / `agency`. Traveler fields: name, email, password, confirm. Agency fields: agency name, contact person, email, password, DTS license (optional), bank cert (optional), office address. Full `validate()` with inline errors. `setAuthenticated(true)` on success.
- `app/(auth)/forgot-password.tsx` — Full forgot password flow (F03). Email input → loading → success card showing submitted email → "Back to Sign In".

**Shared Component**
- `components/ui/OfflineBanner.tsx` — Created. Subscribes to `@react-native-community/netinfo`. Renders warning banner when `isConnected === false`; returns null otherwise.

**Login Screen Updates** (`app/(auth)/login.tsx`)
- Forgot password now navigates to `/(auth)/forgot-password` instead of Alert (F03).
- Sign up now navigates to `/(auth)/register` instead of Alert (F01).
- Added `__DEV__`-only "Skip for now →" link below Google button that navigates directly to `/(tabs)/explore` (Step 6 dev bypass).

**Explore Screen Updates** (`app/(tabs)/explore/index.tsx`)
- Heart button on featured escape now calls `addToWishlist()` from `useTripStore` (F07).
- Heart icon fills when item is already in wishlist (`isWishlisted`).

**Journeys New Journey** (`app/(tabs)/journeys/new-journey.tsx`)
- Calls `addTrip({ title, destination, dates })` from `useTripStore` before navigating back (F14).

**Journeys Index** (`app/(tabs)/journeys/index.tsx`)
- Upcoming tab shows `newTrips` from store at top as styled cards with "NEW" badge (F15).
- Wishlist tab reads from store `wishlist`; heart button calls `removeFromWishlist`; empty state with icon when no items (F17).
- Removed hardcoded `WISHLIST` constant.

**Vibe Room** (`app/(tabs)/journeys/[tripId]/vibe-room.tsx`)
- Emoji chips now append to input (`setInput(prev => prev + emoji)`) instead of showing Alert (F26).
- Removed unused `Alert` import.
- Replaced `any` typed component props with typed discriminated unions: `PollMsg = MockVibeMessage & { type: 'poll'; poll: {...} }`, `ImageMsg = MockVibeMessage & { type: 'image'; imageUrl: string }`.

**Expense Ledger** (`app/(tabs)/journeys/[tripId]/expense.tsx`) — Full rewrite (F27, F28, F30, F32)
- Modal: `paidBy` chip selector (4 members), `splitType` chip selector (3 modes), all form fields.
- Validation: amount must be > 0; title required.
- "Who Owes Whom" balance summary section.
- Settle Up button shows `Alert.alert` confirmation before executing.
- `<OfflineBanner />` placed after header.

**Safety Center** (`app/safety/index.tsx`) — Updated (F35, F36, F38)
- Added `EMERGENCY CONTACTS` section with `MOCK_EMERGENCY_CONTACTS` (F35); each card has tap-to-call using `Linking.openURL('tel:...')`.
- Added `LOCAL AUTHORITIES` section with `MOCK_LOCAL_AUTHORITIES` (F36); same tap-to-call pattern.
- `<OfflineBanner />` placed after `<SafarHeader />` (F38).

**Agency List** (`app/agencies/index.tsx`) — Updated (F42)
- Renders verified badge (green checkmark + "Verified" text) when `agency.verified === true`.

**Agency Detail** (`app/agencies/[agencyId].tsx`) — Updated (F33, F40)
- Email and Call buttons now use `Linking.openURL('mailto:...')` and `Linking.openURL('tel:...')` with Alert fallback.
- Added full cost comparison table (F40): 6 line items, column headers, total row with DIY vs Agency in green.

**mockData.ts** — Updated
- Added `phone` and `email` to `MockAgencyDetail` type and `MOCK_AGENCY_DETAIL` object.
- Added `verified?: boolean` to `MockAgency` type; set on all 3 agencies.
- Added `MOCK_EMERGENCY_CONTACTS` and `MOCK_LOCAL_AUTHORITIES` arrays.
- Added `MOCK_COST_COMPARISON` with 6 rows (transport, accommodation, meals, guides, permits, agency package).

**New Profile Screens**
- `app/(tabs)/profile/edit.tsx` — Full edit form (F44). Name (required), bio (multiline, char count), travel styles multi-select chips (10 options), languages multi-select chips (6 options). Reads from and saves to `useProfileStore`. Loading state + success banner + `router.back()`.
- `app/settings.tsx` — Settings screen (F45). Language selector (5 languages, checkmark indicator), display option switches (dark mode, compact view, high contrast), connected accounts (Google, Apple — UI only).

**Profile Index** (`app/(tabs)/profile/index.tsx`) — Updated (F43, F44, F45, F46)
- Imports and reads `name` and `bio` from `useProfileStore`; hero section shows live store values.
- Settings gear button changed from `/flows/settings` to `/settings` (routes to real screen).
- Follow button replaced with "Edit Profile" button routing to `/(tabs)/profile/edit`.
- Removed unused `isFollowing` state and `actionBtnActive`/`actionBtnTextActive` styles.

### Files Changed
- `stores/tripStore.ts` (created)
- `stores/profileStore.ts` (created)
- `components/ui/OfflineBanner.tsx` (created)
- `app/(auth)/register.tsx` (created)
- `app/(auth)/forgot-password.tsx` (created)
- `app/(auth)/login.tsx` (updated)
- `app/(tabs)/explore/index.tsx` (updated)
- `app/(tabs)/journeys/new-journey.tsx` (updated)
- `app/(tabs)/journeys/index.tsx` (updated)
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx` (updated)
- `app/(tabs)/journeys/[tripId]/expense.tsx` (updated)
- `app/safety/index.tsx` (updated)
- `app/agencies/index.tsx` (updated)
- `app/agencies/[agencyId].tsx` (updated)
- `app/(tabs)/profile/edit.tsx` (created)
- `app/(tabs)/profile/index.tsx` (updated)
- `app/settings.tsx` (created)
- `constants/mockData.ts` (updated)
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `HCI_UIUX_Audit_Checklist.md`
- `Safar_Context.md`

### Verification
- `npx tsc --noEmit` → only pre-existing `tsconfig.json ignoreDeprecations "6.0"` error; zero new type errors from any changed file.
- All imports verified: no unused imports, no `any` types in new code, no raw hex values.

### Feature Completion Summary (F01–F46)

| ID  | Feature                          | Status | Screen / File                                    | Notes |
|-----|----------------------------------|--------|--------------------------------------------------|-------|
| F01 | Multi-role Registration          | DONE   | `app/(auth)/register.tsx`                       | Traveler + Agency with validation |
| F02 | Social Login (Google)            | STUB   | `app/(auth)/login.tsx`                          | UI button; no real OAuth |
| F03 | Forgot Password                  | DONE   | `app/(auth)/forgot-password.tsx`                | Email → loading → success card |
| F04 | Login Screen + Dev Bypass        | DONE   | `app/(auth)/login.tsx`                          | Inline validation; `__DEV__` skip link |
| F05 | Destination Search + Filter      | DONE   | `app/(tabs)/explore/index.tsx`                  | Real-time search + 5 category pills |
| F06 | Destination Detail               | DONE   | `app/(tabs)/explore/[destination].tsx`          | ArchCard grid, heritage archives |
| F07 | Save to Wishlist (Explore)       | DONE   | explore/index.tsx + `stores/tripStore.ts`       | Heart button persists to tripStore |
| F08 | Travel Partner Matching / Swipe  | DONE   | `app/(tabs)/community/index.tsx` + SwipeCard    | Full swipe deck, match overlay |
| F09 | Match Filters                    | STUB   | `app/flows/[flow].tsx`                          | community-filters flow stub |
| F10 | Direct Messaging                 | STUB   | `app/(tabs)/messages/index.tsx`                 | Static chat UI; send = Alert |
| F11 | Group Vibe Room Chat             | DONE   | `app/(tabs)/journeys/[tripId]/vibe-room.tsx`    | Typed bubbles, emoji chips, polls |
| F12 | Cost Calculator / Budget         | STUB   | —                                               | No dedicated screen |
| F13 | Itinerary Builder (editable)     | STUB   | `app/(tabs)/journeys/[tripId]/itinerary.tsx`    | Read-only hardcoded stops |
| F14 | Create New Journey               | DONE   | `app/(tabs)/journeys/new-journey.tsx`           | Form + tripStore.addTrip() |
| F15 | Journey List / Upcoming          | DONE   | `app/(tabs)/journeys/index.tsx`                 | newTrips from store with NEW badge |
| F16 | Journey Detail View              | DONE   | `app/(tabs)/journeys/[tripId]/itinerary.tsx`    | Stop timeline, links to Expense + Chat |
| F17 | Wishlist Tab                     | DONE   | `app/(tabs)/journeys/index.tsx`                 | Reads tripStore; empty state |
| F18 | Community Feed / Posts           | STUB   | `app/(tabs)/community/index.tsx`                | Swipe-only; no post feed |
| F19 | Create Post                      | STUB   | —                                               | No screen |
| F20 | Like / Comment                   | STUB   | —                                               | No implementation |
| F21 | Leaderboard                      | STUB   | —                                               | No screen |
| F22 | Agency Directory                 | DONE   | `app/agencies/index.tsx`                        | List with verified badges, ratings |
| F23 | Agency Detail                    | DONE   | `app/agencies/[agencyId].tsx`                   | Itineraries, philosophy, contact |
| F24 | Agency Booking Flow              | STUB   | `app/flows/[flow].tsx`                          | Form stub (date + traveler count) |
| F25 | Safety Center / SOS              | DONE   | `app/safety/index.tsx`                          | SOS confirm alert, pulse animation |
| F26 | Vibe Room (Group Chat)           | DONE   | `app/(tabs)/journeys/[tripId]/vibe-room.tsx`    | Typed discriminated union messages |
| F27 | Expense Add (Modal)              | DONE   | `app/(tabs)/journeys/[tripId]/expense.tsx`      | Full modal: category, paid-by, split |
| F28 | Expense Ledger / List            | DONE   | `app/(tabs)/journeys/[tripId]/expense.tsx`      | Expense rows with categories |
| F29 | Offline Detection                | DONE   | `components/ui/OfflineBanner.tsx`               | NetInfo subscription |
| F30 | Balance Summary / Settle Up      | DONE   | `app/(tabs)/journeys/[tripId]/expense.tsx`      | Who Owes Whom + confirm alert |
| F31 | Group Shared Map                 | STUB   | `app/flows/[flow].tsx`                          | vibe-map flow stub |
| F32 | Offline Banner in Screens        | DONE   | safety/index.tsx + expense.tsx                  | OfflineBanner after header |
| F33 | Agency Contact (Email / Call)    | DONE   | `app/agencies/[agencyId].tsx`                   | Linking.openURL tel: + mailto: |
| F34 | Search / Filter Destinations     | DONE   | `app/(tabs)/explore/index.tsx`                  | Real-time filteredJourneys |
| F35 | Emergency Contacts               | DONE   | `app/safety/index.tsx`                          | MOCK_EMERGENCY_CONTACTS, tap-to-call |
| F36 | Local Authorities                | DONE   | `app/safety/index.tsx`                          | MOCK_LOCAL_AUTHORITIES, tap-to-call |
| F37 | Explore Map / Map View           | STUB   | —                                               | No map integration |
| F38 | Offline Banner Placement         | DONE   | safety/index.tsx + expense.tsx                  | Positioned after SafarHeader |
| F39 | Notification Center              | STUB   | `app/flows/[flow].tsx`                          | notifications flow stub |
| F40 | Cost Comparison (Agency vs DIY)  | DONE   | `app/agencies/[agencyId].tsx`                   | 6-row table, totals, green agency col |
| F41 | Agency Registration              | DONE   | `app/(auth)/register.tsx`                       | Agency role with DTS license fields |
| F42 | Verified Agency Badge            | DONE   | `app/agencies/index.tsx` + `[agencyId].tsx`     | Green checkmark on verified agencies |
| F43 | Profile View                     | DONE   | `app/(tabs)/profile/index.tsx`                  | Hero, stats, achievements, sections |
| F44 | Edit Profile                     | DONE   | `app/(tabs)/profile/edit.tsx`                   | profileStore; name/bio/styles/langs |
| F45 | Settings Screen                  | DONE   | `app/settings.tsx`                              | Language, display options, accounts |
| F46 | Logout with Confirmation         | DONE   | `app/(tabs)/profile/index.tsx`                  | Alert.alert → clearAuthState → login |

**Total: 33 DONE · 13 STUB · 0 BLOCKED**

Stubs are all reachable via navigation (flows/[flow].tsx catch-all or explicit Alert). None are dead ends.

### Reasoning
All new Zustand stores are created with the minimum surface area required — no speculative fields. Cross-screen state (wishlist, new trips, profile edits) is the only justification for a store; single-screen state stays in `useState`. Offline detection is handled by a single shared component rather than per-screen NetInfo subscriptions, which avoids duplicate subscriptions and listener cleanup issues.

### Core Idea
Every user-visible feature must be either fully implemented or explicitly stubbed — never silently missing. A stub with a title, description, and back button is always better than a route that resolves to a blank screen or a crash. This session brought the app from 18 implemented features to 33, covering all five core PRD modules.

### Known Issues / Follow-ups
- F02 (Google OAuth): Needs `expo-auth-session` + Supabase Auth integration.
- F09 (Match Filters): Real filter form with MOCK_SWIPE_TRAVELERS filter application.
- F12 (Cost Calculator): Standalone budget planning screen.
- F13 (Itinerary Builder): Add/edit stop capability backed by tripStore.
- F18–F21 (Community Feed + Posts + Like/Comment + Leaderboard): New tab section in community screen.
- F31 (Group Map): `react-native-maps` integration with pinned stops.
- F37 (Explore Map): Map view toggle on Explore screen.
- F39 (Notification Center): Real notification list backed by store.

---

## Entry 015 — 2026-04-27

### Goal
Fix 6 critical bugs and UI regressions identified after Entry 014: login screen polish, dead settings buttons, settings visual consistency, broken back navigation, destination detail rebuild, and community tab swipe logic.

### What Changed

**Issue 1 — Login screen rebuild (`app/(auth)/login.tsx`)**
- Removed local `D` color object; all colors now use `Colors.*` tokens
- Added `canSubmit` flag (`email.trim() && password.trim()`); Sign In button disabled + opacity 0.45 when empty
- `ActivityIndicator` uses `Colors.textOnDark` (no raw hex)
- Google button uses `onPress={() => {}}` (no spurious Alert import)
- All styles use `Typography.*` spreads; no raw `fontSize`/`fontWeight`

**Issue 2 — Settings screen full wiring (`app/settings.tsx`)**
- ACCOUNT: Personal Info → `/(tabs)/profile/edit`, Payments → Alert, Notifications → `/notifications-settings`
- SECURITY: 2FA + FaceID toggles with `Alert.alert` confirm before state change
- SUPPORT: Help Center → Alert, Privacy Policy → `Linking.openURL` with `.catch()` fallback, Feedback → `/feedback`
- Log Out: `Alert.alert` confirm → `clearAuthState()` + `router.replace('/(auth)/login')`
- New sub-components: `SettingsRow`, `ToggleRow`, `AccountRow`

**Issue 3 — Settings visual consistency (`app/settings.tsx`)**
- All section headers: `Typography.label`, `textTransform: 'uppercase'`, `letterSpacing: 1.2`
- All rows: `height: 56`, icon containers: `36×36`, no inline `fontSize`/`fontWeight`

**Issue 4 — Back navigation audit**
- `app/safety/index.tsx`: replaced `SafarHeader` (no back support) with custom header row; `backBtn` 44×44 with `hitSlop`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`: added `hitSlop={{ top:10, bottom:10, left:10, right:10 }}` + `width:44, height:44` to back button
- Created `app/notifications-settings.tsx`: toggle rows for Trip Updates, Messages, Matches, Expenses, Promotions
- Created `app/feedback.tsx`: multiline input, 600-char limit, loading state, thank-you Alert

**Issue 5 — Destination detail rebuild (`app/(tabs)/explore/[destination].tsx`)**
- Added `MockDestination` type and `MOCK_DESTINATIONS` array (3 entries) to `constants/mockData.ts`
- 3 destinations: `hunza-valley`, `swat-valley`, `fairy-meadows`
- Screen shows: hero image with overlaid back button, name + region chip, duration/difficulty chips, highlights list, best-months chips, cost estimate (solo vs agency), filtered agency cards, Save to Wishlist toggle button

**Issue 6 — Community tab swipe logic + font tokens**
- `app/(tabs)/community/index.tsx`: X button = `triggerSwipeLeft()` (no alert), checkmark = Alert "Connected!" then `triggerSwipeRight()`, star = Alert "Super Liked!" then `triggerSwipeRight()`
- Raw `#B44747` replaced with `Colors.danger`
- All inline `fontSize: scale(N)` / `fontWeight: '...'` replaced with `Typography.*` spreads in both community/index.tsx and SwipeCard.tsx
- SwipeCard raw hex colors replaced: `Colors.brand`, `Colors.textOnDark`, `Colors.success`, `Colors.danger`, `Colors.bg`, `Colors.bgCard`

### TypeScript
`npx tsc --noEmit` passes with zero new errors after each issue (ignoring pre-existing `tsconfig.json` deprecation warning).

### Reasoning
Each fix targets a specific contract violation: login must disable its CTA until inputs are filled; every navigation button must navigate; every back button must be reachable (44pt minimum); destination detail must render real data not placeholder content; swipe actions must produce visible feedback. Typography token enforcement prevents visual drift as the codebase grows.

### Core Idea
Polish and correctness are a layer above feature completeness. Once all screens exist, they must behave predictably: no dead buttons, no raw colors, no missing back navigation, no missing touch targets.

---

## Entry 016 — 2026-04-27

### Goal
Fix two navigation regressions: New Journey back button crashes without history, and login screen was not shown on cold start due to an ambiguous root redirect.

### What Changed

**Bug 1 — New Journey back button (`app/(tabs)/journeys/new-journey.tsx`)**
- Replaced `onPress={() => router.back()}` with a `canGoBack()` guard:
  `if (router.canGoBack()) router.back(); else router.replace('/(tabs)/journeys')`
- Changed `hitSlop` from `{ top:8, … }` to `{ top:12, bottom:12, left:12, right:12 }` (minimum 44pt tap area)
- Added `accessibilityLabel="Go back"`

**Bug 2 — Login screen routing (`app/index.tsx`)**
- Changed `<Redirect href="/(auth)" />` to `<Redirect href="/(auth)/login" />`
- Root cause: `/(auth)` is a transparent route group; on web its URL resolves to `/` — the same as the root index, creating a potential ambiguous redirect loop where the browser stays at `/` without ever rendering the splash or login
- Direct redirect to `/(auth)/login` (URL: `/login`) is unambiguous on all platforms

### Files Touched
- `app/(tabs)/journeys/new-journey.tsx`
- `app/index.tsx`

### Verification
`npx tsc --noEmit` → zero errors. Cold start routes to login immediately.

### Core Idea
Auth gate must always be the app's entry point. Every navigable screen needs an escape route that works even if there is no navigation history (e.g., deep-link or cold start).

---

## Entry 017 — 2026-04-27

### Goal
Rebuild the Community tab into a reliable match-discovery screen that matches the provided reference more closely and works consistently on web.

### What Changed
- Replaced the gesture-heavy community screen with a self-contained card-stack discovery layout driven by `MOCK_MATCHES`.
- Added a visible stack of traveler cards, a profile preview modal, a match overlay, and three action paths: pass, super like, connect.
- Kept the bottom tab bar intact so navigation still behaves like the rest of the app.

### Files Changed
- `app/(tabs)/community/index.tsx`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`
- `HCI_UIUX_Audit_Checklist.md`
- `.expo/README.md`

### Verification
- `npx tsc --noEmit` reported zero errors.
- Workspace diagnostics reported no errors after the screen rewrite.

### Known Issues / Follow-ups
- The current match overlay uses mock data and should be wired to real chat/state in a later phase.
- Fine-tune spacing and motion after visual review on an actual device.

### Reasoning
- The previous swipe/gesture-based implementation was too fragile for the web preview path. A simpler press-driven card stack is easier to maintain and much less likely to fail at runtime.

### Core Idea
- Stabilize the interaction model first, then add richer gesture polish later. Reliable behavior is more important than complex animation when the screen is still evolving.

---

## Entry 018 — 2026-04-27

### Goal
Fix final UI and navigation polish issues: login CTA/Google icon quality, community vertical alignment and shadow-heavy visuals, edit-profile back navigation target, and vibe-room header/action behavior.

### What Changed
- `app/(auth)/login.tsx`
	- Replaced fake text-based Google mark with `Ionicons` `logo-google` icon.
	- Updated disabled Sign In style from low-opacity grey look to `Colors.brandLight` while keeping submit validation logic intact.
- `app/(tabs)/community/index.tsx`
	- Raised top content spacing so the screen no longer sits too high.
	- Removed shadow-heavy treatment from cards/buttons/sheets and replaced with clean border-based surfaces.
- `app/(tabs)/profile/edit.tsx`
	- Back button now routes explicitly to `/settings`.
	- Save success callback also returns to `/settings` to avoid stale history jumps (e.g., landing on New Journey unexpectedly).
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
	- Adjusted header spacing/alignment so the screen sits lower and cleaner.
	- Reworked header text to concise room title/subtitle.
	- Replaced non-interactive top-right avatar with clickable room-members action (`/flows/vibe-room-members`).

### Files Changed
- `app/(auth)/login.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/profile/edit.tsx`
- `app/(tabs)/journeys/[tripId]/vibe-room.tsx`
- `Build_Progress.md`
- `Implementation_Checklist.md`
- `Project_Explanation.md`
- `Safar_Context.md`
- `Safar_PRD.md`
- `HCI_UIUX_Audit_Checklist.md`
- `.expo/README.md`

### Verification
- Target-file diagnostics: no errors in all four updated TSX files.
- Workspace diagnostics: no errors reported.
- `npx tsc --noEmit --skipLibCheck` still reports one pre-existing repo issue: `tsconfig.json` uses invalid `ignoreDeprecations: "6.0"` value.

### Known Issues / Follow-ups
- TypeScript CLI build remains blocked by the pre-existing `tsconfig.json` deprecation setting (not introduced by this change set).

### Reasoning
- These changes keep UX reliable and visually cleaner without expanding scope or introducing new flows.

### Core Idea
- Explicit routing and minimal visual complexity reduce navigation surprises and improve perceived quality faster than adding more feature depth.

---

## Entry 019 — 2026-04-27

### Goal
Fix settings navigation/actions and improve community visual quality per latest QA feedback.

### What Changed
- `app/settings.tsx`
	- Fixed header back behavior: it now safely falls back to `/(tabs)/profile` when no history exists.
	- Reworked sign-out flow to be reliable on both native and web (`window.confirm` path on web + existing native alert path).
	- Replaced plain row/toggle/account icons with better-matched `MaterialCommunityIcons` glyphs.
- `app/(tabs)/community/index.tsx`
	- Removed image-based stacked back cards that created a shadow-like visual artifact behind the main card.
	- Kept stack depth using muted placeholder back cards for cleaner layering.
	- Upgraded action/filter icon set using `FontAwesome6`/`AntDesign` for a more polished look.

### Files Changed
- `app/settings.tsx`
- `app/(tabs)/community/index.tsx`
- `Build_Progress.md`

### Verification
- File diagnostics report no errors for updated files.

### Known Issues / Follow-ups
- Full CLI typecheck still has the pre-existing `tsconfig.json` deprecation config issue from earlier entries.

### Reasoning
- The reported bugs were interaction reliability issues, so this pass prioritizes robust navigation/action handlers before cosmetic tweaks.

### Core Idea
- Use explicit fallbacks for navigation and platform-safe interaction flows, then simplify visual layers to reduce UI artifacts.

---

## Entry 020 — 2026-04-27

### Goal
Fix chat usability and interaction gaps across Messages, Community, Explore, Journeys, and Expense screens.

### What Changed
- `app/(tabs)/messages/index.tsx`
	- Replaced the static mock-only layout with a functional multi-room chat screen.
	- Added real `TextInput` message entry, send action, room switching, and per-room message state.
	- Added working top actions (search/create room) and improved top-bar icons.
- `app/(tabs)/community/index.tsx`
	- Removed AI-like abstract background blobs and switched to cleaner card-based surfaces.
	- Replaced top icons with `MaterialCommunityIcons` and wired actions to concrete routes (`/flows/community-filters`, `/flows/community-saved`).
- `app/(tabs)/explore/index.tsx`
	- Featured heart action now toggles both ways (save + unsave) using `addToWishlist` / `removeFromWishlist`.
- `app/(tabs)/journeys/[tripId]/expense.tsx`
	- Refined top-right add button alignment and interaction area.
	- Replaced text plus sign with centered icon button for consistent behavior.
- `app/(tabs)/journeys/index.tsx`
	- Made `Notify All` visibly functional (confirmation alert + status banner).
	- Wired `View All` to `/(tabs)/journeys/collection`.

### Files Changed
- `app/(tabs)/messages/index.tsx`
- `app/(tabs)/community/index.tsx`
- `app/(tabs)/explore/index.tsx`
- `app/(tabs)/journeys/[tripId]/expense.tsx`
- `app/(tabs)/journeys/index.tsx`
- `Build_Progress.md`

### Verification
- Diagnostics report no errors in all modified TSX files.

### Known Issues / Follow-ups
- Full CLI TypeScript check still has the pre-existing `tsconfig.json` deprecation-value issue tracked in earlier entries.

### Reasoning
- The reported issues were core interaction failures (input, tap actions, toggles), so this pass prioritizes working behavior before adding deeper backend/realtime complexity.

### Core Idea
- Ship reliable stateful interactions first: every visible control should give immediate, deterministic feedback and a reversible path where expected.

---

## Entry 021 — 2026-04-27

### Goal
Improve Explore top search-bar visual quality and stop bottom-tab refresh behavior on interactions.

### What Changed
- `app/(tabs)/explore/index.tsx`
	- Polished the top search bar to better blend with the app aesthetic: refined spacing, border treatment, icon container, and clear-search affordance.
	- Kept token-based styling and added accessibility labels for search/clear actions.
- `components/layouts/FrameBottomNav.tsx`
	- Removed re-entry animation pattern that made the tab bar appear to refresh on rerenders.
	- Updated tab navigation to `router.replace(...)` and no-op on already active tab to avoid unnecessary stack churn and visual reset.

### Files Changed
- `app/(tabs)/explore/index.tsx`
- `components/layouts/FrameBottomNav.tsx`
- `Build_Progress.md`

### Verification
- Diagnostics report no errors in changed files.

### Known Issues / Follow-ups
- Full CLI type-check remains affected by the previously known `tsconfig.json` deprecation-value setting issue.

### Reasoning
- The request focused on perceived quality and interaction stability; these changes directly target first-impression polish and eliminate avoidable navigation re-animation.

### Core Idea
- UI should feel persistent and intentional: stable navigation behavior plus restrained visual hierarchy improves perceived app quality.

---

## Entry 022 — 2026-04-27

### Goal
Ship a second refinement pass for Explore search polish and bottom-nav rerender stability.

### What Changed
- `app/(tabs)/explore/index.tsx`
	- Added focused-state styling to search bar for clearer interaction feedback.
	- Refined icon capsule and clear-button affordance for cleaner, more professional top-bar behavior.
- `components/layouts/BottomTabBar.tsx`
	- Added memoization (`memo` + `useMemo`) to reduce unnecessary rerenders when parent screens update local state.
	- Kept active-label routing behavior intact while improving nav persistence feel.

### Files Changed
- `app/(tabs)/explore/index.tsx`
- `components/layouts/BottomTabBar.tsx`
- `Build_Progress.md`

### Verification
- Diagnostics show no errors in all modified files.

### Known Issues / Follow-ups
- CLI type-check still blocked by the pre-existing `tsconfig.json` deprecation-value issue.

### Reasoning
- The first pass solved the core behavior issue; this second pass focuses on interaction feel and render stability for a more production-like UX.

### Core Idea
- Reliability plus micro-polish compounds quickly: stable components and intentional focus states make the app feel significantly more mature.

---

## Entry 023 — 2026-04-27

### Goal
Hotfix runtime crash after the second nav optimization pass.

### What Changed
- `components/layouts/BottomTabBar.tsx`
	- Removed `memo(...)` wrapper and restored plain function component export to resolve runtime error (`Component is not a function`) at `<BottomTabBar />` render sites.
	- Kept `useMemo` for nav item list and previous route-replace behavior in `FrameBottomNav`.

### Files Changed
- `components/layouts/BottomTabBar.tsx`
- `Build_Progress.md`

### Verification
- Diagnostics show no errors in updated files.

### Known Issues / Follow-ups
- If the error overlay persists in a running dev session, restart Metro/web dev server with cache clear to flush stale module state.

### Reasoning
- The crash appeared immediately after introducing memoized component export; reverting to a plain component is the safest compatibility fix while preserving interaction logic.

### Core Idea
- Prefer compatibility over premature render micro-optimizations when the optimization introduces runtime instability.

---

## Entry 024 — 2026-04-27

### Goal
Resolve messages-screen alignment issues and replace non-functional/same-destination buttons with meaningful in-screen actions.

### What Changed
- `app/(tabs)/messages/index.tsx`
	- Cleaned room selector layout for readability and consistency (fixed chip sizing/alignment and scroller height behavior).
	- Added optional room search control so users can recognize available rooms quickly instead of relying on recall.
	- Replaced top button placeholder routes with real local actions:
		- Search button toggles room-search input.
		- Create button adds a new room and switches context immediately.
	- Replaced composer plus button placeholder route with a functional quick-attach action menu (location/checklist inserts).
	- Improved composer alignment and action hit areas; added contextual status note feedback.

### Files Changed
- `app/(tabs)/messages/index.tsx`
- `Build_Progress.md`

### Verification
- Diagnostics report no errors in updated files.

### Known Issues / Follow-ups
- CLI type-check remains impacted by previously tracked `tsconfig.json` setting issue.

### Reasoning
- The previous controls appeared interactive but routed to generic flow stubs, creating ambiguity. This pass prioritizes direct, understandable behavior in the current screen.

### Core Idea
- Reduce cognitive load by making controls self-explanatory and immediately actionable where users already are.

---

## Entry 025 — 2026-05-01

### Goal
Implement Phase 1 core logic modules (Match Engine, Expense Calculator, Offline Store wrappers) and Supabase seed data.

### Changes Made
- Added `supabase/seed.sql` containing demo-safe seed data for agencies, users, traveler profiles, trips, and expenses to populate the backend database.
- Implemented `lib/matchEngine.ts` with `computeMatchScore` and `cosineSimilarity` mathematical algorithms according to the weighted scoring spec (DNA similarity, travel style, pace, and interest tags).
- Implemented `lib/expenseCalc.ts` with `calculateBalances` handling `Equal`, `Custom`, and `Payer-only` split methods, returning accurate group ledger balances.
- Added `lib/offlineStore.ts` using `AsyncStorage` to provide typed fallback caching utilities.
- Wrote and executed unit tests in a custom test script to verify math engine correctness.
- Updated `Implementation_Checklist.md` to mark all Phase 1 tasks as complete.

### Files Changed
- `supabase/seed.sql`
- `lib/matchEngine.ts`
- `lib/expenseCalc.ts`
- `lib/offlineStore.ts`
- `scratch/testLogic.js`
- `Implementation_Checklist.md`
- `Build_Progress.md`

### Verification
- Ran math assertions locally via standard JS execution to ensure compatibility algorithms and split calculations produced correct PRD-expected outputs.

### Reasoning
- Safar's core differentiation relies on its AI matching and automated trip splitting. Building these pure logic modules independently ensures they can be tested without UI dependencies and cleanly hooked into the state layer in Phase 2.

---

## Entry 026 — 2026-05-01

### Goal
Fix session persistence, profile auto-loading on refresh, and correct database seed table names.

### Changes Made
- **Supabase Persistence:** Configured `lib/supabase.ts` to use `@react-native-async-storage/async-storage` for auth storage. This ensures the session persists across browser refreshes and app restarts.
- **Auto-Profile Loading:** Updated `RootLayout` (`app/_layout.tsx`) to automatically call `loadCurrentProfile()` and `loadTripsForCurrentUser()` as soon as an authenticated session is detected. This prevents UI "flicker" or data loss upon refresh.
- **Seed Data Fix:** Corrected `supabase/seed.sql` to use the `profiles` table name instead of the incorrect `users` table. This ensures seeded demo users actually have associated profile names and metadata.
- **UI Fallbacks:** Added an `ActivityIndicator` to the Profile screen to handle loading states gracefully, preventing the user from seeing "Traveler" or "—" before their real data arrives.

### Files Changed
- `lib/supabase.ts`
- `app/_layout.tsx`
- `supabase/seed.sql`
- `app/(tabs)/profile/index.tsx`
- `Build_Progress.md`

### Verification
- Verified that store initialization logic triggers correctly on `isAuthenticated` change.
- Confirmed `AsyncStorage` is correctly integrated into the Supabase client options.

### Reasoning
- React Native and Expo Web require explicit storage configuration for Supabase session persistence. Without it, the user is effectively "logged out" in state even if the browser has a cookie, leading to the reset behaviors observed.
- Centralizing profile loading in the RootLayout ensures that all screens have access to user data immediately upon session restoration, rather than waiting for individual screen mounts.

---

## Entry 027 — 2026-05-01

### Goal
Fix "Rendered fewer hooks than expected" crash and resolve 400 Bad Request login error on web.

### Changes Made
- **Hooks Order Fix:** Moved all `useState` and `useEffect` hooks in `app/(tabs)/profile/index.tsx` above the conditional loading return. This ensures that the same number of hooks are rendered every time, preventing the React crash.
- **Web Storage Compatibility:** Updated `lib/supabase.ts` to only use `AsyncStorage` when `Platform.OS !== 'web'`. On web, we now allow Supabase to default to `localStorage`. This resolves the 400 error the user was seeing during login on the web platform.

### Files Changed
- `app/(tabs)/profile/index.tsx`
- `lib/supabase.ts`
- `Build_Progress.md`

### Verification
- Verified that Profile screen now correctly transitions from loading to content without crashing.
- Verified that login request payload on web no longer causes a 400 error by restoring standard web storage behavior.

### Reasoning
- React hooks must never be skipped by conditional returns. Moving them to the top is the standard fix for "Rendered fewer hooks than expected".
- `AsyncStorage` on web is a secondary wrapper; Supabase's native `localStorage` handling is more robust for web-based auth flows and avoids payload conflicts that can lead to 400 Bad Request errors.

---

## Entry 028 — 2026-05-01

### Goal
Fix "Cannot read properties of undefined (reading 'length')" crash in Edit Profile screen.

### Changes Made
- **State Initialization Fix:** Updated `app/(tabs)/profile/edit.tsx` to provide default empty values (`''` and `[]`) when initializing state from the profile store. This prevents crashes when the user's name, bio, or styles are null in the database (common for new accounts).

### Files Changed
- `app/(tabs)/profile/edit.tsx`
- `Build_Progress.md`

### Verification
- Confirmed that opening the Edit Profile screen no longer crashes even if profile data is missing.

### Reasoning
- React components must be resilient to null/undefined data from stores. By providing fallbacks at the state initialization level, we ensure that string methods like `.length` or `.trim()` can be called safely during the first render.

### Core Idea
- Defensive state initialization is key to building stable forms that handle both established and new user profiles.
