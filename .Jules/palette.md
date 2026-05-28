## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2024-05-18 - Chat Input Disabled State Feedback
**Learning:** When users submit a chat message, leaving the input enabled while waiting for a response (`isTyping`) can lead to accidental multi-submissions and feels unresponsive. Additionally, disabled submit buttons need dynamic tooltips explaining exactly why they are disabled (e.g., "Generating response..." vs "Message cannot be empty") and corresponding cursor states (`cursor-wait` vs `cursor-not-allowed`).
**Action:** Always disable text inputs and submit buttons during async operations. Apply conditional classes for tooltips and cursors instead of relying on a global `disabled:cursor-not-allowed`, ensuring the feedback perfectly maps to the failing condition.
