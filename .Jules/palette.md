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
## 2025-02-28 - Semantic Buttons for Empty States
**Learning:** Visually empty state areas that act as interactive actions (e.g., 'Load Track' dropzones or placeholders) should be built using semantic `<button>` elements rather than `<div>` elements to natively support keyboard focus management and screen readers.
**Action:** Always replace `<div onClick>` on empty-state actionable areas with `<button>`, adding explicit `aria-label`, `title`, and contextual focus indicators (e.g., `focus-visible:ring-indigo-400`).

## 2025-02-28 - Custom Slider Accessibility
**Learning:** Custom interactive elements mimicking sliders (e.g., waveform progress bars built with `<div>` elements) are inaccessible without explicit ARIA roles, states, and native keyboard event handlers (like `onKeyDown` capturing ArrowLeft/ArrowRight) to guarantee full accessibility.
**Action:** Implement `role="slider"`, `tabIndex={0}`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes alongside `focus-visible` keyboard focus rings on custom slider elements. Ensure `onKeyDown` handlers exist to control value changes via keyboard navigation.
