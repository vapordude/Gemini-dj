# Palette's Journal

## 2024-05-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** The DJ UI heavily relies on icon-only buttons (Play, Pause, Sync, Loop, FX knobs, Toggle Chat, Close Chat, Send Message, etc.) without any `aria-label` attributes. This completely breaks accessibility for screen-reader users who will just hear "button".
**Action:** Adding `aria-label`s and `title` attributes (for tooltips on hover) to improve both accessibility and discoverability.