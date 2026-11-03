## 2024-05-24 - Cascading Re-renders
**Learning:** High-frequency state updates in top-level custom hooks (like useAudioDeck) trigger global application re-renders, causing severe UI lag.
**Action:** Manage rapidly updating state (like currentTime) locally in leaf UI components using polling (e.g. requestAnimationFrame or setInterval) rather than React state.
