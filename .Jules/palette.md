## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Tab Accessibility Implementation
**Learning:** Custom UI tabs often miss crucial ARIA attributes and focus styles when built hastily with `div` and `button` tags, relying only on visual active states.
**Action:** Always ensure custom tab patterns implement `role="tablist"` on the container, and `role="tab"`, `aria-selected`, `aria-label`, and `focus-visible` classes on the individual tab buttons for full keyboard and screen reader accessibility.
