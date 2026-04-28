## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-19 - Accessible Custom Inputs via Tailwind `peer`
**Learning:** Making aesthetically styled inputs (where the native input is visually hidden using `opacity-0`) accessible is critical. While they function via mouse interactions, keyboard navigation lacks visual focus states.
**Action:** Use Tailwind's `peer` utility on the visually hidden `<input>` and apply conditional focus styling (e.g. `peer-focus-visible:ring-2`) to its adjacent visual proxy element, ensuring `aria-label` and `title` attributes are included. Order matters: the `<input className="peer">` must precede the styled sibling in the DOM.
