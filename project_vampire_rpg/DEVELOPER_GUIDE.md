# Developer Guide: 3D Vampire RPG

This guide explains the technical architecture and conventions of this project.

## Project Structure

The project follows a non-module, class-based structure. All scripts are loaded globally via `<script>` tags in `index.html`. The load order is critical.

*   `three.min.js`: The core Three.js library.
*   `World.js`: Defines the `World` class for the ground and environment.
*   `InputController.js`: Defines the `InputController` class for keyboard input.
*   `Player.js`: Defines the `Player` class for the main character.
*   `ThirdPersonCamera.js`: Defines the `ThirdPersonCamera` class.
*   `main.js`: The main entry point that initializes and orchestrates all the above components.

## Class Overview

*   **`main.js`**: Initializes the scene, renderer, camera, and all controller/game object classes. It also contains the main `animate` loop.
*   **`World`**: Creates the static environment, including the ground plane and procedurally placed trees.
*   **`InputController`**: A simple utility that listens for global `keydown` and `keyup` events and stores the current state of the keys.
*   **`Player`**: Represents the player character. It creates the 3D model and handles all physics and movement logic in its `update()` method, based on the state of the `InputController`.
*   **`ThirdPersonCamera`**: Manages the camera's position, making it smoothly follow the player's model.

## Debugging Learnings

The project initially failed to render (white/black screen) when using ES6 modules with an `importmap`. The root cause was likely a subtle issue with module loading order or browser compatibility. The problem was resolved by switching to a traditional script-loading architecture. **Future development should continue with this approach unless a full build pipeline (like Vite or Webpack) is introduced.**

---

## Interactive Debugging & Resolution Log

This log chronicles the interactive debugging process required to solve initial rendering failures. It highlights where autonomous execution was insufficient and user feedback was critical.

**1. Initial State & User Report 1:**
*   **Agent Action:** The initial project was built using ES6 modules via an `importmap`.
*   **User Feedback:** `"Weiße Seite mit so nem kleinen Ding oben links"` (White page with a small thing in the top left).
*   **Analysis:** This indicated that the HTML/CSS was loading, but the JavaScript failed to execute or render the 3D scene. The primary suspect was the module loading strategy.

**2. Debugging Step 1: Simplification & Architecture Change**
*   **Agent Action:** To isolate the problem, I proposed and executed a plan to:
    1.  Replace the `importmap` and module scripts with traditional `<script>` tags for Three.js and the local class files.
    2.  Drastically simplify `main.js` to a minimal "hello world" example (a single rotating cube).
*   **User Feedback (Critical Input):** `"ja ist er"` (yes it is), confirming that the rotating cube was visible.
*   **Analysis:** This confirmation was crucial. It proved that the core rendering pipeline (Three.js library, renderer, canvas) was functional and that the problem lay within the original, module-based class structure.

**3. Debugging Step 2: Incremental Re-integration**
*   **Agent Action:** I proceeded to re-integrate the original classes (`World`, `Player`, `InputController`, `ThirdPersonCamera`) one by one, each time converting them to work in a global scope (removing `import`/`export`).
*   **User Feedback:** `"i see only a black and nothing else"` (I see only a black and nothing else).
*   **Analysis:** This new symptom was a positive sign. A "black screen" indicates that the JavaScript is now running and the Three.js renderer is clearing the canvas, but nothing is visible. This pointed away from a script execution error and towards a rendering issue (lighting or camera position).

**4. Debugging Step 3: Investigating the Black Screen**
*   **Agent Action:** My immediate hypothesis was an issue with the scene's lighting. I dramatically increased the ambient light intensity to make any object in the camera's view visible, regardless of other light sources.
*   **User Feedback (Pending):** The user logged off for the night before confirming if the lighting change resolved the black screen. The last action was to ask the user to test this change.

**Conclusion of Session:**
The project is currently in a debug state where the lighting has been temporarily intensified. The primary learning—that a traditional script-loading approach is more robust for this setup—has been documented. The next agent instance should first verify with the user if the black screen issue is resolved before proceeding.
