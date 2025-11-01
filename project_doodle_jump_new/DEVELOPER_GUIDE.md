# Developer Guide: Doodle Jump Clone

This guide provides a technical overview of the project's structure and code.

## Project Structure

*   `index.html`: Main entry point. Contains the `<canvas>` element where the game is rendered.
*   `style.css`: Minimal styling to center the canvas.
*   `script.js`: The core of the application, containing all game logic.
*   `test.html`: A separate HTML page to run the tests.
*   `doodle.test.js`: The JavaScript file containing the test suite.

## Code Architecture (`script.js`)

The code is organized into several classes to encapsulate logic and state:

### `InputHandler`
*   **Responsibility:** Listens for `keydown` and `keyup` events for the arrow keys.
*   **State:** Maintains an array (`this.keys`) of currently pressed keys.

### `Player`
*   **Responsibility:** Manages the player's state and behavior.
*   **State:** `x`, `y`, `width`, `height`, `speedX`, `speedY`.
*   **Methods:**
    *   `draw(context)`: Renders the player on the canvas.
    *   `update()`: Handles movement, gravity, and collision detection.
    *   `jump()`: Sets the player's vertical speed to the game's `jumpStrength`.

### `Platform`
*   **Responsibility:** A simple class representing a single platform.
*   **State:** `x`, `y`, `width`, `height`.
*   **Methods:** `draw(context)`.

### `Game`
*   **Responsibility:** The main orchestrator of the game.
*   **State:** Holds instances of the `InputHandler`, `Player`, and an array of `platforms`. Also manages game-wide properties like `gravity` and `jumpStrength`.
*   **Methods:**
    *   `createPlatforms()`: Logic for procedurally generating the platforms.
    *   `update()`: Calls the player's update method and handles camera and game-over logic.
    *   `draw()`: Clears the canvas and calls the draw methods of the player and platforms.
    *   `getGameState()`: Exposes a clean, read-only object of the game's state for testing.

## Game Loop

The main game loop is a function called `gameLoop()` which is initiated by `requestAnimationFrame`. It calls `game.update()` and `game.draw()` on each frame to create the animation and gameplay.

## Testing

Tests are run by opening `test.html`. The `doodle.test.js` script contains a simple testing framework that asserts conditions about the game's state by creating a `Game` instance and using the `getGameState()` method.