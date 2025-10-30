# Meta Learnings: Game Development Projects

This document synthesizes general strategies and architectural improvements for future AI-driven development tasks, based on observations from the Snake and Breakout game projects.

---

### 1. Game Loop Implementation: `requestAnimationFrame` over `setInterval`

-   **Observation:** The Snake project used `setInterval` for its game loop, while the Breakout project used `requestAnimationFrame`.

-   **Learning:** `requestAnimationFrame` is the superior method for rendering loops in browser-based games and animations. It is more efficient, as it allows the browser to optimize the timing of renders, which prevents visual tearing and reduces CPU/GPU load when the browser tab is not active.

-   **Future Action:** For all future projects involving animation or real-time rendering, `requestAnimationFrame` will be the default choice for the main loop. `setInterval` should be reserved for non-UI, periodic logic (e.g., checking a server status every few seconds).

---

### 2. Code Architecture: Design for Testability from the Start

-   **Observation:** The Snake project required a significant refactoring effort to make it testable after the initial implementation. The Breakout project was built monolithically without automated testing in mind.

-   **Learning:** Building testability into the architecture from the beginning is far more efficient than retrofitting it later. This involves a clear separation of concerns.

-   **Future Action:** All future projects will be architected with testability in mind from the first line of code. This includes:
    1.  **Encapsulating State:** All application logic and state will be contained within a primary object or module (e.g., a `Game` or `App` object), rather than using loose global variables.
    2.  **Separating Logic from Rendering:** The functions that update state (`update()`) will be kept separate from the functions that draw to the screen (`draw()`).
    3.  **Providing State Access:** A method like `getGameState()` will be included by default to provide a clean interface for tests to inspect the application's internal state.

---

### 3. Promoting Reusability: Towards a Generic Game Engine

-   **Observation:** Both the Snake and Breakout games were created from scratch. While simple, they share foundational components: a canvas setup, a game loop, object drawing, and collision detection.

-   **Learning:** Significant efficiency gains are possible by abstracting these common components into a reusable module.

-   **Future Action:** For the next game development task, the first step will be to create a generic `engine.js`. This module could handle:
    -   Canvas creation and setup.
    -   A reusable game loop manager that calls `update` and `draw`.
    -   Basic 2D vector math and simple physics.
    -   A simple `GameObject` class that other elements can inherit from.
    The specific game (`snake.js`, `breakout.js`) would then import and extend this engine, focusing only on the unique game logic.
