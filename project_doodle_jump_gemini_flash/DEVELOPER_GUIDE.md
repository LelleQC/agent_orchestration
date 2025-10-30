# Doodle Jump Game - Developer Guide

This guide provides an overview of the Doodle Jump game's architecture, code structure, and instructions for developers who wish to modify or extend the game.

## Architecture

The game follows a modular architecture, separating game logic from rendering and input handling. This design promotes testability, maintainability, and scalability.

-   **`index.html`**: The entry point of the application. It sets up the HTML canvas, links the CSS for styling, and includes the main `script.js` file.
-   **`style.css`**: Contains basic CSS rules for the game's visual presentation, primarily styling the canvas and body.
-   **`script.js`**: Acts as the game's renderer and input handler. It initializes the canvas context, draws game elements based on the state managed by `game.js`, and listens for keyboard and touch events to update the game state.
-   **`game.js`**: The core game logic module. It defines game configurations, manages the player, platforms, and items, handles physics (gravity, jumps), collision detection, scoring, and game over conditions. This module is designed to be independent of the DOM and rendering, making it easily testable.
-   **`doodle.test.js`**: Contains unit tests for the functions and logic defined in `game.js`. It uses a simple assertion mechanism to verify game mechanics.

## Code Structure

### `game.js`

This module exports several key components:

-   **`config`**: An object containing global game settings such as canvas dimensions, player and platform sizes, gravity, jump force, and movement speed.
-   **`player`**: An object representing the player character, including its position (`x`, `y`), dimensions (`width`, `height`), velocities (`dx`, `dy`), and jump state (`isJumping`).
-   **`platforms`**: An array of platform objects, each with `x`, `y`, `width`, and `height` properties.
-   **`items`**: An array of item objects (e.g., springs), each with `x`, `y`, `width`, `height`, and `type` properties.
-   **`score`**: The current game score.
-   **`gameOver`**: A boolean indicating if the game has ended.
-   **`createPlatforms()`**: Initializes the `platforms` array with a set number of platforms at random positions.
-   **`createItems()`**: Populates the `items` array by randomly placing items on existing platforms.
-   **`movePlayerLeft()`**: Updates the player's `x` position to move left, respecting canvas boundaries.
-   **`movePlayerRight()`**: Updates the player's `x` position to move right, respecting canvas boundaries.
-   **`updatePlayerPosition()`**: Applies gravity to the player's `dy` and updates `player.y`. Handles collision with the bottom of the canvas.
-   **`checkPlatformCollision(player, platform)`**: Determines if the player is colliding with a given platform while falling.
-   **`updateScore(dy)`**: Increments the score based on the player's upward movement.
-   **`checkGameOver()`**: Checks if the player has fallen off the screen, setting `gameOver` to `true` if so.

### `script.js`

-   **`canvas`, `ctx`**: References to the HTML canvas element and its 2D rendering context.
-   **`rightPressed`, `leftPressed`**: Boolean flags to track keyboard input for horizontal movement.
-   **`animationFrameId`**: Stores the ID returned by `requestAnimationFrame` for controlling the game loop.
-   **`drawPlatforms()`, `drawItems()`, `drawPlayer()`, `drawScore()`**: Functions responsible for drawing the respective game elements on the canvas.
-   **`gameLoop()`**: The main game loop that clears the canvas, updates the game state by calling functions from `game.js`, handles camera follow, checks for item collisions, and redraws the scene.
-   **Event Listeners**: Sets up `keydown`, `keyup`, `touchstart`, `touchmove`, and `touchend` event listeners to capture user input and translate it into game actions.

## Extending the Game

### Adding New Item Types

1.  **`game.js`**: 
    *   Modify `createItems()` to introduce new item types with different probabilities.
    *   Add logic within `gameLoop` (or a new function in `game.js`) to handle the effects of new item types when the player collides with them.
2.  **`script.js`**: 
    *   Update `drawItems()` to render new item types with appropriate visuals (e.g., different colors or shapes).

### Adding New Platform Types

1.  **`game.js`**: 
    *   Modify `createPlatforms()` to generate different platform types (e.g., moving platforms, crumbling platforms) with unique properties.
    *   Implement new logic in `game.js` to handle the behavior of these new platform types (e.g., movement, destruction).
2.  **`script.js`**: 
    *   Update `drawPlatforms()` to render new platform types distinctly.

### Improving Graphics and Sounds

*   **Graphics**: Replace `ctx.fillRect` calls with image drawing (`ctx.drawImage`) for more visually appealing sprites. Consider using a sprite sheet for animations.
*   **Sounds**: Integrate an audio library or use the Web Audio API to add background music, jump sounds, and collision effects.

## Running Tests

Unit tests are located in `doodle.test.js`. To run them, execute the following command in your terminal from the project root:

```bash
node doodle.test.js
```

This will run all defined tests and report their status.
