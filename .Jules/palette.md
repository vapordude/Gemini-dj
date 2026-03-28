## 2024-05-14 - Visual Disabled States for Buttons

**Learning:** Missing visual disabled states and tooltips on buttons like the manual transition button can create a poor user experience. It's important to pair the `disabled` attribute with clear visual cues (e.g., opacity, cursor changes, color changes) and tooltips to explain *why* the button is disabled.

**Action:** Ensure that buttons that conditionally become disabled clearly show their state and provide tooltips indicating the required conditions to re-enable them. Always include `focus-visible` styles for keyboard navigation.
