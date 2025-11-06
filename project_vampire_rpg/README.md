# 3D Vampire RPG

A high-quality 3D RPG web game built with Three.js.

## Current Status

The project has completed its initial architectural phase. All core systems, designated as `[PRO-TODO]` tasks in the `roadmap.md`, have been implemented. This includes:

*   A 3D rendering engine setup.
*   A controllable player character with walking, jumping, and flying mechanics.
*   A third-person camera system.
*   A procedural world generation system.

**Debugging Note:** The project was initially built using ES6 modules but encountered rendering issues (a "white screen"). The issue was resolved by switching to a more robust, traditional script-loading approach where libraries and classes are loaded in order via `<script>` tags in `index.html`. This is the current, working setup.

## How to Run

1.  You do not need a local server. Simply open the `index.html` file in a modern web browser that supports WebGL.
2.  Use **WASD** to move, **Space** to jump, and **F** to toggle fly mode.
