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

## 2026-09-02 - Interactive Custom Elements and Accessible State Toggles
**Learning:** Custom UI elements like waveform progress bars constructed with generic `div` elements need extensive ARIA properties (`role="slider"`, `tabIndex`, `aria-valuenow`, etc.) and native keyboard event handlers (`onKeyDown`) to provide an equitable experience to screen reader and keyboard users. Furthermore, state-toggling icon buttons (like Play/Pause, Sync, Loop) require contextual `title`, `aria-label`, and `aria-pressed` properties alongside explicit focus indicators.
**Action:** When implementing custom inputs, always mirror native semantic behavior using full ARIA slider properties and key handlers. For all toggleable icon buttons, ensure dynamic `aria-pressed` values, descriptive labels, and visible `focus-visible` rings.
