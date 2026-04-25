## 2024-05-18 - Multi-Condition Disabled States
**Learning:** This app features complex actions like the AutoDJ transition button which require clear feedback when disabled due to multiple conditions (generating vs missing tracks). Without this, sighted users are left guessing the reason for the disabled state.
**Action:** Use dynamic `title` tooltips and specific cursor classes (e.g., `cursor-wait` vs `cursor-not-allowed`) for multi-condition disabled states to provide precise context to the user. Also ensure focus indicators are present.
