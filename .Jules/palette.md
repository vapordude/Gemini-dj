## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.
## 2025-05-23 - Multi-condition disabled tooltips for AI Chat
**Learning:** In AI chat interfaces, users can be confused when a submit button is disabled due to multiple overlapping conditions (e.g., waiting for AI generation vs. empty input). Providing a dynamic `title` tooltip that explicitly explains the current blocking state (e.g., "Generating response..." vs "Enter a message to send") significantly improves clarity over a generic "Disabled" state.
**Action:** When implementing disabled states that rely on multiple boolean flags (like `loading || !isValid`), use a conditional statement to render the exact failing reason in the element's tooltip/title.
