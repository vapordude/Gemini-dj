## 2024-04-02 - Explaining Complex Disabled States
**Learning:** When a button requires multiple complex conditions to be enabled (like tracks loaded on both Deck A and Deck B), standard disabled states (e.g., just greyed out) often leave users guessing what went wrong.
**Action:** Always provide explicit visual cues (like subdued background and `cursor-not-allowed`) alongside a dynamic `title` attribute that acts as a tooltip to explain exactly *why* the button is disabled and *how* to enable it.
