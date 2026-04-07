## 2024-05-15 - Icon Button Accessibility and Disabled State Feedback
**Learning:** Icon-only buttons often lack accessible names, breaking screen reader functionality, and conditionally disabled buttons without tooltips leave users confused as to why the action is unavailable.
**Action:** Always pair `disabled` attributes with clear visual cues (`disabled:opacity-50`, `disabled:cursor-not-allowed`) and a `title` tooltip explaining the required conditions to enable the button. Add `aria-label` and `title` to all icon-only buttons for both a11y and tooltip discovery.
