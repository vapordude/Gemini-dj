## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2024-05-21 - Prevent Multi-Submission in AI Chat
**Learning:** In AI chat interfaces, users may intuitively press "Send" multiple times if the system response is delayed or if the UI doesn't actively indicate it is processing. This can cause multi-submission bugs or overlapping AI processes.
**Action:** Always bind the `disabled` state of both the text input and the send button to the `isTyping` or processing state, paired with visual feedback like `disabled:opacity-50 disabled:cursor-not-allowed` and appropriate conditional tooltips to explain why the action is temporarily unavailable.
