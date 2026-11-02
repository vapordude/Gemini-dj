## 2026-11-02 - Optimize rendering by removing currentTime from global state
**Learning:** Storing rapidly updating values like `currentTime` from `timeupdate` events in top-level custom hooks causes O(N) cascading re-renders across the app, degrading performance.
**Action:** Maintain state close to the UI consumer (e.g., local state with `requestAnimationFrame`) and use polling (e.g., `setInterval`) in non-UI hooks to read from DOM nodes directly.
