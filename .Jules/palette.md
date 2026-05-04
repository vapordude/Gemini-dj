## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2026-05-04 - Keyboard Focus on Visually Hidden Custom Controls
**Learning:** When building stylized custom inputs (like EQs or faders) where the native input is visually hidden, the keyboard focus state is completely lost to screen readers and keyboard users unless specifically handled.
**Action:** Apply Tailwind's 'peer' class to the hidden native input and 'peer-focus-visible:ring-2' (or similar) to the custom adjacent UI element. Ensure the input element with the 'peer' class comes immediately before the styled element in the DOM tree.
