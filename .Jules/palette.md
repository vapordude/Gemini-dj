## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.
## 2025-02-12 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with `div` and `button` elements lack inherent semantic meaning, preventing screen readers from understanding the grouping and active state of the tabs. Furthermore, icon-only tabs are opaque to non-visual users.
**Action:** When implementing custom tab systems, ensure the container has `role="tablist"` (and `aria-label`), and individual tabs have `role="tab"`, `aria-selected`, explicit ARIA labels/titles (especially if icon-only), and clear `focus-visible` styling for keyboard navigation.
