## 2025-03-01 - [Localize Rapidly Updating State to Prevent Cascading Re-renders]
**Learning:** Storing rapidly changing values (like audio `currentTime` from `timeupdate` events) in top-level custom hooks triggers O(N) cascading re-renders across the entire application, causing significant performance overhead.
**Action:** Keep rapidly updating state as close to the UI consumer as possible (e.g., using `requestAnimationFrame` in local component state) and use polling for non-UI logic (like Auto DJ transitions) rather than reactive dependencies on the rapidly changing value.
