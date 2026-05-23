## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2026-05-22 - AI Chat Input State
**Learning:** When building interactive AI chat forms, failing to disable the input field and submit button during the `isTyping` or generation phase leads to multi-submission bugs or confused users typing without response. Using visual feedback like `opacity-50` alone isn't enough; the elements must be semantically disabled.
**Action:** Always disable inputs and submit buttons when the system is generating a response (e.g., `isTyping`), applying immediate visual feedback using `disabled:opacity-50 disabled:cursor-not-allowed` or `disabled:cursor-wait` to prevent unexpected behavior.
