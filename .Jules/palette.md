## 2024-05-24 - Ambiguous Disabled Button States
**Learning:** In the DJ application, complex state conditions for buttons (like the manual transition button depending on multiple deck states + generating state) can lead to incomplete disabled styling. Users might see an active-looking button that doesn't respond because the secondary disabled condition (missing tracks) wasn't visually handled.
**Action:** Always verify that every logical reason for disabling a button has an associated visual state (opacity, cursor, color) and a helpful tooltip/title explaining *why* it's disabled.
