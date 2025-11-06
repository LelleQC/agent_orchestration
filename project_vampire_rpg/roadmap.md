# Roadmap: 3D Vampire RPG

This document outlines the development plan for a high-quality 3D RPG web game. The project is structured to be initiated by a powerful LLM (PRO) and potentially continued by a simpler one (FLASH).

**Technology Stack:**
*   **3D Engine:** Three.js
*   **Platform:** HTML5 / CSS3 / JavaScript (ES6 Modules)

**Complexity Tags:**
*   `[PRO-TODO]`: A complex task requiring architectural decisions, advanced logic, or initial implementation of a core system. **Must be handled by a PRO-level model.**
*   `[FLASH-TODO]`: A simpler, well-defined, or repetitive task that can be handled by a FLASH-level model once the core systems are in place.

---

## Phase 1: Core Engine & Scene Setup (PRO)
*Goal: Establish a basic, renderable 3D scene.*

-   `[DONE]` Create the main project files (`index.html`, `style.css`, `main.js`).
-   `[DONE]` Set up the Three.js scene, renderer, and a basic perspective camera in `main.js`.
-   `[DONE]` Add basic window resizing logic to keep the aspect ratio correct.
-   `[DONE]` Implement the main animation loop (`requestAnimationFrame`).
-   `[DONE]` Create an atmospheric lighting setup (e.g., dim ambient light and a moon-like directional light).
-   `[DONE]` Create a large ground plane for the world.

## Phase 2: Player Character & Controls (PRO)
*Goal: Get a controllable character into the scene.*

-   `[DONE]` Create a `Player` class/module.
-   `[DONE]` Design and implement the vampire character model using multiple geometric primitives (e.g., for head, torso, limbs). This will be the "Vampire" object.
-   `[DONE]` Add the player character to the scene.
-   `[DONE]` Implement a keyboard input handler for player movement (WASD).
-   `[DONE]` Implement a third-person camera that follows the player smoothly.
-   `[DONE]` Implement basic player physics: gravity and collision with the ground plane.

## Phase 3: World & Environment (PRO & FLASH)
*Goal: Create an interesting and expansive world to explore.*

-   `[DONE]` Create a `World` class/module responsible for environmental objects.
-   `[DONE]` Implement a procedural function to generate and place environmental assets (e.g., trees, rocks).
-   `[DONE]` Use the procedural function to add a large number of trees to the world.
-   `[DONE]` Use the procedural function to add a large number of rocks and other details.
-   `[DONE]` Add fog to the scene for more atmosphere (`scene.fog`).

## Phase 4: Core Gameplay Mechanics (PRO)
*Goal: Implement the key vampire abilities.*

-   `[DONE]` Implement the "fly" mode for the player.
-   `[DONE]` Debounce the flight mode toggle key to prevent rapid switching.
-   `[DONE]` Create a simple UI element to indicate current mode (Walking/Flying).

## Phase 5: Documentation & Refinement (FLASH)
*Goal: Improve code quality and add content, preparing for handover.*

-   `[DONE]` Add comments to all major classes and functions created by the PRO model.
-   `[DONE]` Create a `README.md` with instructions on how to run the game.
-   `[DONE]` Create a `DEVELOPER_GUIDE.md` explaining the project structure and how to add new world objects.
-   `[DONE]` Adjust lighting and material colors for better visual appeal.
-   `[DONE]` Add more variety to the procedurally generated world objects.

