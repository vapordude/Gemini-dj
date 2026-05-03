## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Visually Hidden Controls Missing ARIA
**Learning:** This app frequently employs custom UI elements (like the crossfader, EQ faders, and library tabs) where the native HTML elements (like `<input type="range">`) are made visually hidden (`opacity-0`) or stripped of text, while custom styled `div`s and icons are shown. This pattern strips crucial context from screen readers.
**Action:** When creating custom styled inputs or icon-only tabs, always ensure the visually hidden native element has a descriptive `aria-label` and `title`. For tabs, ensure appropriate `role="tab"` and `aria-selected` attributes are applied.
