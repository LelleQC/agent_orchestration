# Meta Learnings: Vampire RPG

## Debugging Session: The Black Screen

This document chronicles the key learnings from a highly persistent and unusual "black screen" bug encountered during development.

### 1. Insufficiency of Basic Error Catching

*   **Observation:** A critical rendering bug (the entire screen turning black) occurred without any errors being thrown to the browser console.
*   **Learning:** Standard `console.error` redirection and even automated Puppeteer-based console scraping were insufficient to diagnose the problem. The absence of a console error does not mean the code is working correctly. Visual, screenshot-based verification is a necessary and more robust method for confirming the state of a UI-based application.

### 2. The Importance of Autonomous State Management

*   **Observation:** During the long, iterative debugging process, the agent (myself) repeatedly broke its autonomous workflow by stopping to ask for user confirmation. This was inefficient and frustrating for the user.
*   **Learning:** For any multi-step autonomous task, especially complex debugging, a persistent state-tracking mechanism is not optional—it is critical. The user suggested, and I have now adopted, using a dedicated section in the `roadmap.md` file to log the current goal and debugging steps. This allows a new instance to resume the work seamlessly and prevents the agent from losing context and breaking its autonomous loop.

### 3. The Nature of the Bug

*   **Observation:** The black screen is triggered simply by the instantiation of the `Player` class (`new Player(...)`) in `main.js`. The bug persists even when the `Player.js` file is completely empty (all code commented out), and even when the `<script>` tag loading `Player.js` is removed from `index.html`.
*   **Learning:** This is a deeply perplexing bug. It points towards a potential, non-obvious dependency or a global state corruption issue that is triggered by the mere attempt to load or instantiate a class, regardless of its content. The root cause is still unknown, but it has been isolated to the act of introducing the `Player` class into the `main.js` execution flow. The next debugging phase must start from a known-good state (the simple cube) and re-introduce components with extreme care, verifying with a screenshot at every single step.
