```markdown
# SAFAR — Design & HCI Consolidation

This consolidated design document merges the project's HCI/UIUX audit and project explanation so design decisions and usability requirements remain easy to find.

---

## HCI + UI/UX Comprehensive Audit Checklist

# SAFAR HCI + UI/UX Comprehensive Audit Checklist

## Execution Rule
- Make smallest targeted change per issue.
- Use tokens from `constants/Theme.ts` and `constants/colors.ts` only.
- No raw hex values in screens/components.

## Principle Coverage

### 1) Visibility of System Status
- [ ] Add centered mahogany `ActivityIndicator` to every async-loading screen.
- [x] Add simulated 300ms list loading where real APIs are not wired (messages screen, journeys screen).
- [x] Add loading+disabled state for async action buttons (register, forgot-password, edit-profile, new-journey, expense add modal).
- [x] Add visible success confirmation before navigation (forgot-password success card, edit-profile success banner).

### 2) Match System to Real World
- [ ] Replace technical/system copy with plain travel language.
- [ ] Rewrite error copy to human-readable actions.
- [ ] Add natural-language empty states.
- [ ] Use action-oriented button labels.

### 3) User Control and Freedom
- [x] Ensure close/cancel action on every modal/overlay (expense modal has X close button, forgot-password has Cancel).
- [x] Add SOS confirm alert with destructive action (safety/index.tsx).
- [x] Confirm destructive actions (sign out: Alert.alert; settle up: Alert.alert; SOS: Alert.alert).
- [x] Ensure back navigation on all deep screens (register, forgot-password, settings, profile/edit, safety, agencies, itinerary, expense, vibe-room, notifications-settings, feedback).
- [x] Back buttons 44×44 with `hitSlop={{ top:10, bottom:10, left:10, right:10 }}` on all deep screens (vibe-room and safety fixed in Issue 4).

### 4) Consistency and Standards
- [ ] Enforce radius tokens: cards 16, buttons 12, inputs 10, pills 999.
- [ ] Enforce 8pt grid / spacing multiples of 4.
- [x] Ensure text uses Typography tokens (no inline fontSize/fontWeight) — community/index.tsx and SwipeCard.tsx fully converted (Issue 6).
- [ ] Enforce mahogany shadow token and divider token.
- [ ] Ensure BottomTabBar active/inactive/background colors match spec.

### 5) Error Prevention
- [x] Disable login submit until required fields filled (`canSubmit` flag, opacity 0.45 disabled state — Issue 1).
- [x] Numeric fields use `keyboardType="numeric"` and non-negative validation (expense amount: > 0 check).
- [x] Add loading+disabled guard on async action buttons (isLoading state prevents double-submit).
- [x] Add `maxLength` on appropriate form fields (bio: 200, name: 60).

### 6) Recognition Over Recall
- [ ] Tabs include icon + label.
- [ ] Filter chips show names.
- [ ] Expense rows show payer and amount.
- [x] Match cards show prominent compatibility percentage.

### 7) Flexibility and Efficiency
- [ ] Explore search filters in real time.
- [ ] Filter chips toggle and update immediately.
- [ ] Ensure large touch targets for frequently used list items.

### 8) Aesthetic and Minimalist
- [ ] Remove purely decorative non-functional UI.
- [ ] One primary CTA per screen.
- [ ] Simplify cards to essential info.
- [ ] Remove TODO/Coming Soon placeholders.

### 9) Error Recovery
- [ ] Error states include clear guidance + `Try Again` action.
- [ ] Inline field-level validation in warm error color.

### 10) Help and Documentation
- [ ] Input placeholders show valid example.
- [ ] Safety Center sections include one-line descriptions.
- [ ] Unclear icons get visible text labels.

... (Checklist continued in original file)

---

## Project Explanation (summary)

# SAFAR Project Explanation

Every change explanation must clearly include: what was changed, why it was changed, how it was verified, and the core idea behind it.

Current primary testing mode is the web variant: `npx expo start --web --clear`.

## Simple Summary

SAFAR is a mobile app for travel in Pakistan.

It helps with:
- finding travel partners,
- chatting in a group trip room,
- splitting trip expenses,
- using a safety screen for emergencies,
- and browsing verified travel agencies.

## Key Design Decisions
- Token-driven design (`constants/Theme.ts`) to ensure consistent colors, spacing, and typography.
- Minimal visual motifs (parchment background + mahogany accents) to match the heritage theme.
- Accessibility and hit-target rules: 44×44 minimum touch targets, `hitSlop` for icons.
- Offline-first considerations for trips, safety, and expense ledger.

*(For the full project explanation and rationale see the consolidated Implementation document.)*

```
