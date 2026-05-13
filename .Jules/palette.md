## 2024-05-18 - Multi-Condition Disabled States
**Learning:** When buttons have multiple reasons for being disabled (e.g., missing tracks vs. currently generating), using global `disabled:cursor-not-allowed` creates poor UX if the user is actually waiting. Similarly, a generic tooltip isn't helpful if the disabled reason isn't obvious.
**Action:** Always conditionally apply cursor classes (`cursor-wait` vs `cursor-not-allowed`) and `title` tooltips based on the exact condition that is failing. Ensure `opacity` or similar visual cues correctly correspond to the state.

## 2024-05-18 - Accessible Custom Tabs
**Learning:** Custom UI tabs built with generic `div` and `button` elements are inaccessible to screen readers without explicit ARIA roles. Icon-only tabs further degrade accessibility without proper labeling and keyboard focus indicators.
**Action:** Always implement `role="tablist"` on the container (and optionally `aria-label`). For individual tabs, ensure `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes are applied. Always include explicit focus states (e.g., `focus-visible:ring-2`) for keyboard navigation.

## 2025-02-19 - Accessible Icon-Only Controls & Contextual Tooltips
**Learning:** Icon-only floating action buttons (like chat toggles) and inline action buttons (like send message) are frequently overlooked for accessibility. Furthermore, disabling a button without clarifying why (e.g., waiting for AI vs. empty input) causes user confusion.
**Action:** Always add `aria-label`, `title`, and explicit keyboard focus indicators (`focus-visible:ring-2`) to icon-only interactive elements. When disabling an action button, conditionally update its `title` tooltip to explain exactly why the action is unavailable.
