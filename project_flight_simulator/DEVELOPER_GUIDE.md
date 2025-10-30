# Developer Guide

This guide provides a technical overview of the simple flight simulator project.

## Project Structure

*   `index.html`: The main HTML file that sets up the scene and includes the necessary scripts.
*   `style.css`: The CSS file for basic styling.
*   `script.js`: The core JavaScript file that contains all the game logic.
*   `package.json`: The project's dependencies and scripts.

## Code Overview

The `script.js` file is the heart of the application. It is responsible for:

*   **Scene Setup:** Creating the Three.js scene, camera, and renderer.
*   **Object Creation:** Creating the ground plane and the aircraft model.
*   **User Input:** Handling keyboard input for aircraft controls.
*   **Game Logic:** Updating the aircraft's position and rotation based on user input.
*   **Animation Loop:** Rendering the scene on each frame.

### Key Functions

*   `animate()`: The main animation loop that is called on every frame.
*   `updateAircraft()`: Updates the aircraft's position and rotation based on keyboard input.

## How to Modify

*   **Aircraft Model:** The aircraft model is created in the `script.js` file. You can modify the `THREE.Group` named `aircraft` to change its appearance.
*   **Physics:** The aircraft's movement is handled in the `updateAircraft()` function. You can modify the `speed` variable and the logic within this function to change the aircraft's flight characteristics.
*   **Controls:** The keyboard controls are handled by event listeners at the top of the `script.js` file. You can modify the `updateAircraft` function to change how the keyboard inputs affect the aircraft.
