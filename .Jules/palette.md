## 2024-05-24 - Icon Button Accessibility

**Learning:** When using custom icon SVG components for buttons (common in interactive UI elements like chat toggles or media controls), developers frequently forget to add `aria-label`s and visible focus states, rendering them invisible to screen readers and difficult to navigate via keyboard. This is especially prevalent when creating complex overlays like `DJChat`.

**Action:** Always verify `aria-label` attributes on `<button>` elements that only contain an SVG or icon. Furthermore, ensure proper keyboard navigation states by using `focus-visible:ring-2 focus-visible:outline-none` alongside appropriate ring colors (like `focus-visible:ring-indigo-400`) to maintain the application's aesthetic.
