
## 2025-10-24 - Avoiding Global Re-renders in Custom Hooks
**Learning:** In React, if a custom hook is instantiated at the root level (e.g., `App.tsx`), any rapidly changing state inside that hook (like tracking `currentTime` via a `timeupdate` event) will cause the entire application to re-render constantly. This can severely degrade performance.
**Action:** When you need to track rapidly changing values (like audio playback time) for UI display, do not store them in root-level custom hooks. Instead, maintain this state locally in the leaf UI components that need it (e.g., `Deck.tsx`), and rely on native DOM event listeners (`timeupdate`) on the `audioRef` directly.
