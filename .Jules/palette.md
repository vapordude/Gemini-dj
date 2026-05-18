## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.
## 2024-05-18 - Chat Input UX & Accessibility
**Learning:** For interactive chat interfaces, disabling the input and send button while the system is generating a response (and when input is empty) provides immediate, necessary visual feedback and prevents unexpected multi-submission bugs. Adding ARIA labels to icon-only toggle/close buttons is critical for screen readers.
**Action:** Always add disabled states linked to `isTyping` or similar loading conditions for chat inputs, along with `disabled:opacity-50 disabled:cursor-not-allowed` styles. Ensure all icon-only action buttons have descriptive `aria-label` and `title` attributes. Provide explicit `focus-visible` styles for keyboard navigation.
