## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2026-05-10 - Custom Tabs Accessibility
**Learning:** Custom tab elements constructed with `div` and `button` lack inherent semantic meaning and keyboard focus styling, which makes them inaccessible to screen readers and keyboard users.
**Action:** Always implement `role="tablist"` on the container and `role="tab"`, `aria-selected`, `aria-label`, and `title` on individual tabs, alongside explicit focus indicators like `focus-visible:ring-2`.
