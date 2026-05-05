## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-05 - Accessible Custom Tab Lists
**Learning:** When building custom icon-only tab navigation, it is crucial to use explicit ARIA roles (`role="tablist"` on container, `role="tab"` on items) and state (`aria-selected`). Since icons lack text, `aria-label` and `title` tooltips must also be provided.
**Action:** Always ensure that custom tab lists contain explicit roles, selected states, labels for screen readers, visible focus indicators (like `focus-visible:ring-2`), and tooltips for sighted users navigating via mouse.
