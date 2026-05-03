# Next Steps & Remaining Work

We have successfully knocked out the vast majority of the core features! The core UI, auth, matching, exploring, and chat structures are mostly solid. Here are the largest remaining "unfinished" tasks from Phase 5 (Feature Delivery) and Phase 6 (Reliability) that we should tackle:

## Option 1: Finish the Vibe Room Features
While text messaging works, the advanced interactive features are still stubbed out:
* **Poll Database Wiring:** The UI for creating polls exists, but we need to wire the "Create Poll" modal to actually insert records into the Supabase `polls` table and broadcast the votes.
* **Message Reactions:** The backend database schema for message reactions (emoji reactions) is ready, but the UI for a long-press reaction picker needs to be built and wired up.

## Option 2: The Itinerary Builder [DONE]
* **Add/Edit Stops:** Users can now dynamically add new stops to their journey via an interactive modal builder.

## Option 3: Safety Center & Store
* **Safety Store:** We have the UI built for the SOS button and safety center, but we need to implement `stores/safetyStore.ts` to manage active SOS state, save emergency contacts, and handle local location flags.

## Option 4: Public Traveler Profiles
* **Cross-Navigation:** When you match with someone in the Community tab or see a follower on your Profile, clicking them should take you to their public traveler profile. This navigation and the public profile view still need to be fully wired up.

## Option 5: Offline Mode & Reliability (Phase 6)
* **Offline Queues:** Since this is a travel app, we need to implement `NetInfo` to detect when the user goes offline, securely queue their chat messages and expense ledger updates locally using `AsyncStorage`, and auto-sync them when the connection returns.
