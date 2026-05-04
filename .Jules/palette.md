## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-19 - Accessible Custom Tabs
**Learning:** Custom tab implementations often lack proper ARIA roles and keyboard accessibility, preventing screen readers from understanding the tabbed interface structure and state.
**Action:** Always add `role="tablist"` to the container, `role="tab"` to individual tabs, `aria-selected` to indicate the active state, and ensure focus indicators are visible (`focus-visible:ring-2 focus-visible:outline-none`) for keyboard navigation.
