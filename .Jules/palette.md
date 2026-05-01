## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-10-25 - Icon-Only Component Accessibility Gaps
**Learning:** In reusable internal components like `TabButton` (used inside `Library.tsx`), missing a mechanism to forward accessible labels results in completely inaccessible icon-only buttons. The lack of standard focus indicators also disproportionately affects keyboard users.
**Action:** When auditing or building custom UI components (especially icon-only wrappers), explicitly define and pass a `label` prop to bind to `aria-label` and `title`, and always include explicit `focus-visible` ring utilities to ensure visibility during keyboard navigation.
