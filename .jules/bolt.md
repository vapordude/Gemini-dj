

## 2025-02-27 - [Prevent App-level Re-renders from Continuous Audio Time Updates]
**Learning:** Storing rapidly updating values like `currentTime` (triggered by `timeupdate` events) in a custom hook's state (`useAudioDeck`) that is imported at the top level (`App.tsx`) causes severe performance bottlenecks. It triggers cascading O(N) re-renders across the entire React application multiple times a second during playback.
**Action:** Always maintain rapidly updating state as close to the UI consumer as possible. Use `requestAnimationFrame` and local component state for progress bars/time displays instead of React global state tied to event listeners.
