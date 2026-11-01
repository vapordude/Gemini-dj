
## 2025-02-27 - [Fix Cascading O(N) App Re-Renders]
**Learning:** Storing highly-frequent event data like `currentTime` (from `timeupdate` events) in a top-level shared hook (`useAudioDeck`) causes severe O(N) cascading re-renders across the entire application.
**Action:** Remove `currentTime` from top-level state. Maintain it locally close to the UI consumer (e.g., `Deck.tsx` using `requestAnimationFrame`) and use polling (e.g., `setInterval` in `useAutoDJ.ts`) to read directly from the `audioRef` object for non-UI logic.
