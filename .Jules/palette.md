## 2026-03-26 - Custom Range Input Focus States with Tailwind
**Learning:** For custom styled inputs where the native input is visually hidden (e.g., `opacity-0`), keyboard navigation breaks because the native focus indicator is invisible. Using Tailwind's `peer` class on the hidden input and styling the adjacent visible element with `peer-focus-visible` restores accessible focus states without compromising the design.
**Action:** Always use the `peer` / `peer-focus-visible` pattern when building custom sliders, toggles, or checkboxes where the native element is visually hidden.
