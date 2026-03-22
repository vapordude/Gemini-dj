## 2026-03-22 - Accessible Custom Sliders
**Learning:** Custom visually-hidden sliders `opacity-0` natively lose their focus rings, causing accessibility issues. The Tailwind `peer` class combined with `peer-focus-visible` on the adjacent stylized element is a robust, CSS-only way to restore keyboard focus visibility.
**Action:** Use the `peer` and `peer-focus-visible` pattern on all custom inputs that visually hide the native input element.
