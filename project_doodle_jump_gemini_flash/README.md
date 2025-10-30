# Doodle Jump Game (Gemini Flash Edition)

This is a simple, endless jumper game built with HTML5 Canvas and JavaScript. The player controls a character that jumps on platforms, trying to get as high as possible. The game features keyboard and touch controls, items (springs), scoring, and a game over condition.

## How to Play

1.  Open `index.html` in your web browser.
2.  Use the **left and right arrow keys** to move the player horizontally.
3.  On touch devices, **swipe left or right** on the canvas to move the player.
4.  The player automatically jumps when landing on a platform.
5.  Collect red square items (springs) for a higher jump boost.
6.  The game ends if the player falls off the bottom of the screen.

## Project Structure

-   `index.html`: The main HTML file that sets up the game canvas and links to CSS and JavaScript files.
-   `style.css`: Contains basic styling for the game canvas and body.
-   `script.js`: The main game script, responsible for rendering the game state and handling user input.
-   `game.js`: Contains the core game logic, including player, platforms, items, physics, collision detection, scoring, and game over conditions.
-   `doodle.test.js`: Unit tests for the game logic in `game.js`.
-   `roadmap.md`: The project roadmap, detailing features and their status.

## Development

To run the unit tests, navigate to the project directory in your terminal and run:

```bash
node doodle.test.js
```
