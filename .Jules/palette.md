## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2025-02-28 - ARIA Labels and Roles for Custom Icon-Only Tabs
**Learning:** Custom UI tabs built with `div` and `button` elements that only contain icons fail accessibility checks because they lack semantic structure and textual representation.
**Action:** Always implement `role="tablist"` on the container, and `role="tab"`, `aria-selected`, `aria-label`, and `title` on individual tabs, alongside explicit focus indicators (e.g., `focus-visible:ring-2`) for keyboard navigation.
