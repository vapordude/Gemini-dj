## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2025-02-23 - Interactive Chat Input States
**Learning:** Interactive chat forms often lack proper state management during asynchronous responses (e.g., when the AI is "typing"), leading to multiple unexpected submissions or confusing user experiences. Icon-only buttons in these chats often lack context for screen readers.
**Action:** Always disable text inputs and submit buttons while awaiting a response, applying clear visual feedback like `disabled:opacity-50 disabled:cursor-not-allowed`. Ensure all icon-only interactive elements (toggle buttons, close buttons, send buttons) include descriptive `aria-label`, `title`, and keyboard focus (`focus-visible`) styles.
