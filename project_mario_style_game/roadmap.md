# Roadmap: Mario-Style Jump and Run Game

This document outlines the development plan for a simple jump and run game.

**Initial Complexity Assessment:** High (was Medium)

**Technology:** HTML5 Canvas, JavaScript (ES6)

## Feature Checklist

### Phase 1: Core Mechanics (Completed)
-   `[DONE] Set up HTML Canvas and basic game loop.`
-   `[DONE] Implement player character with basic physics (gravity).`
-   `[DONE] Implement player movement (left/right).`
-   `[DONE] Implement player jumping.`
-   `[DONE] Create a static level structure with platforms.`
-   `[DONE] Implement player-platform collision detection.`

### Phase 2: Scrolling and World Expansion (Completed)
-   `[DONE] Implement a camera object/system that follows the player.`
-   `[DONE] Modify the `draw` function to render all game objects relative to the camera's position.`
-   `[DONE] Extend the level data in `loadLevel` to be larger than the screen width.`

### Phase 3: Enhanced Visuals and Gameplay (Completed)
-   `[DONE] Refactor the player rendering to create a more distinct character shape.`
-   `[DONE] Add new collectible items (e.g., 'coins') to the level data.`
-   `[DONE] Write a test for player-coin collision detection.`
-   `[DONE] Implement the logic for collecting coins and tracking a score.`
-   `[DONE] Add a simple score display to the UI.`

### Phase 4: Enemies and Combat
-   `[DONE] Create a data structure for enemies.`
-   `[DONE] Add enemy objects to the `loadLevel` function.`
-   `[DONE] Implement basic enemy movement logic (e.g., pacing back and forth).`
-   `[DONE] Write a test for player-enemy collision (side collision).`
-   `[DONE] Write a test for defeating an enemy (jumping on top).`
-   `[DONE] Implement player-enemy collision logic: take damage or defeat enemy.`
-   `[DONE] Add score reward for defeating enemies.`

### Phase 5: Major Level Expansion
-   `[DONE] Refactor `loadLevel` to procedurally or systematically generate a level approximately 20x its current length.`
-   `[DONE] Populate the extended level with a variety of platforms, coins, and enemies.`

### Phase 6: Advanced Scoring and Game End
-   `[DONE] Add a `goal` object at the end of the level.`
-   `[DONE] Write a test for player-goal collision.`
-   `[DONE] Implement a game timer that starts when the game begins.`
-   `[DONE] Implement logic to stop the game and timer when the goal is reached.`
-   `[DONE] Calculate a time bonus based on the final time.`
-   `[DONE] Implement a High Score system using `localStorage` to persist the score.`
-   `[DONE] Create a game-over screen to display the final score, time bonus, and high score.`
