
## 2024-03-24 - Dynamic Tooltips for Multi-Condition Disabled States
**Learning:** When a button can be disabled for multiple reasons (e.g., "Missing tracks" vs "Currently generating"), a static "Disabled" or missing tooltip causes user confusion. Using dynamic tooltips coupled with explicit cursor states (`cursor-wait` vs `cursor-not-allowed`) provides crucial context.
**Action:** Always check if a disabled button has multiple failure states and ensure the `title` attribute dynamically reflects the *specific* reason it is disabled.
