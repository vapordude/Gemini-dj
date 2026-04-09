## 2024-05-15 - Multi-condition disabled states
**Learning:** A button disabled for multiple reasons (e.g., generating, or missing tracks) without explicit tooltips causes user confusion about why the action is blocked. Conditional `title` attributes based on the exact failure condition greatly improves clarity.
**Action:** When buttons have complex `disabled` logic (`A || B || C`), ensure the `title` tooltip mirrors the exact condition failing, rather than a generic "Disabled" message.
