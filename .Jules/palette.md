## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2024-05-26 - Preventing Double Submission via Disabled Chat Input
**Learning:** For interactive chat or form inputs, failing to disable both the input and submit buttons while the system generates a response (e.g., `isTyping`) or when the input is empty allows for unexpected multi-submission bugs and lack of visual feedback.
**Action:** Always disable the input and submit buttons when the system is generating a response or input is empty. Apply immediate visual feedback using `disabled:opacity-50 disabled:cursor-not-allowed` and dynamic `title` tooltips that accurately reflect the current disabled state reason.
