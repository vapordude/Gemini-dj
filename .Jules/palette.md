
## 2024-05-24 - Dynamic Tooltips for Multi-Condition Disabled Buttons
**Learning:** When a button is disabled for multiple distinct reasons (e.g., waiting on async generation vs. missing prerequisites), a single generic "Disabled" tooltip is frustrating. We must dynamically map the `title` attribute to the exact condition failing.
**Action:** Pair the `disabled` state with a conditional `title` attribute that clearly explains the specific blocking factor, and ensure the visual styling (`disabled:opacity-50`, `disabled:cursor-not-allowed`) matches the disabled state.
