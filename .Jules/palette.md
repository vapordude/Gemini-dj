## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom tab components built with `div` and `button` elements lack inherent accessibility semantics. Screen readers need proper ARIA roles to understand the structure.
**Action:** Always implement `role="tablist"` on the container and `role="tab"`, `aria-selected`, `aria-label`, and `title` on the individual tabs. Furthermore, ensure explicit focus indicators (e.g., `focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none`) are present for keyboard navigation.
