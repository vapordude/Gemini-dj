## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.
## 2026-05-15 - Focus Visibility for Visually Hidden Inputs
**Learning:** When building custom sliders (like EQ knobs or crossfaders) where the native `<input type="range">` is visually hidden (e.g., `opacity-0`), keyboard users lose focus visibility if the custom styled elements don't reflect the input's focus state.
**Action:** Use Tailwind's `peer` class on the hidden input and `peer-focus-visible` on the custom stylized sibling to proxy the focus ring. Crucially, the hidden `<input className="peer">` must precede the styled sibling in the DOM for the CSS sibling combinator to work.
