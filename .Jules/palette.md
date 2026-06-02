## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.
## 2026-05-28 - DJChat Accessibility and Interaction Feedback
**Learning:** Chat UI components need robust keyboard accessibility (focus rings) and aria properties to inform screen readers of their toggle states () and purposes. Furthermore, input submission states must be immediately communicated to the user by disabling both the input and submission buttons while displaying clear tooltips and cursors, thereby preventing accidental multi-submissions when the AI is slow to respond.
**Action:** Always apply  and / on chat or modal toggle buttons. Apply  for keyboard navigation. Always disable form inputs and submit buttons with  and the appropriate  classes ( vs ) during async loading states.

## 2024-05-19 - DJChat Accessibility and Interaction Feedback
**Learning:** Chat UI components need robust keyboard accessibility (focus rings) and aria properties to inform screen readers of their toggle states (`aria-expanded`) and purposes. Furthermore, input submission states must be immediately communicated to the user by disabling both the input and submission buttons while displaying clear tooltips and cursors, thereby preventing accidental multi-submissions when the AI is slow to respond.
**Action:** Always apply `aria-expanded` and `aria-label`/`title` on chat or modal toggle buttons. Apply `focus-visible:ring-2 focus-visible:outline-none` for keyboard navigation. Always disable form inputs and submit buttons with `disabled:opacity-50` and the appropriate `cursor` classes (`cursor-wait` vs `cursor-not-allowed`) during async loading states.

## 2026-06-02 - Accessible Visually Hidden Inputs
**Learning:** When styling custom UI elements (like sliders) where the native `<input type="range">` is visually hidden using `opacity-0`, it must be placed *before* the styled sibling in the DOM. Using Tailwind's `peer` class on the input allows the visible sibling to use `peer-focus-visible` to render an accessible keyboard focus ring, preserving a11y without compromising the design.
**Action:** Always ensure visually hidden native inputs include `aria-label`, `title`, and are paired with a focus indicator on their visible counterpart using the `peer` utility pattern.
