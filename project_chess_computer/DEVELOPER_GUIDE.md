# Developer Guide: Chess Computer

This guide provides technical details for developers looking to understand, modify, or extend the Chess Computer project.

---

## 1. Project Structure

-   `index.html`: The main HTML file. It sets up the basic page structure and loads the necessary scripts.
-   `style.css`: Contains all styles for the board, squares, pieces, and status messages.
-   `script.js`: The core of the application. It contains all game logic, UI rendering, and event handling, encapsulated in the `ChessGame` object.
-   `chess.js` (via CDN): The third-party library that handles all underlying chess rules.

---

## 2. How to Modify the Game

### 2.1. Changing Colors and Appearance

All visual aspects can be modified in **`style.css`**.

-   **Board Colors:** To change the colors of the squares, modify the `background-color` property for these CSS classes:
    -   `.light { ... }`
    -   `.dark { ... }`
-   **Selected Square:** The highlight color for a selected piece is controlled by the `.selected` class.
-   **Piece Colors:** The piece colors are set directly in `script.js` within the `renderBoard` function, but could be moved to CSS for easier styling.

### 2.2. Changing the AI Difficulty (Stockfish)

The computer opponent is now powered by the Stockfish engine, running in a separate Web Worker to prevent the UI from freezing.

**Architecture:**
-   `script.js`: The main thread handles the UI and user input. When it's the computer's turn, it sends the current board position (as a FEN string) to the worker.
-   `stockfish_worker.js`: This file simply loads the Stockfish engine from a CDN into the worker's context.
-   **Communication:** The two scripts communicate via `postMessage` and `onmessage` events.

**How to Adjust Difficulty:**

You can change the AI's strength by modifying the commands sent to the Stockfish engine in `script.js`.

1.  **By Skill Level (Recommended for Elo):**
    In the `init` function, you can see the UCI command that sets the skill level. Stockfish's skill level ranges from 0 (easiest) to 20 (full strength).
    ```javascript
    // In the init function:
    this.stockfish.postMessage('setoption name Skill Level value 10'); // Value from 0 to 20
    ```
    A value of **10** is a good starting point for an approximate 2000 Elo, but this can be tuned up or down.

2.  **By Thinking Time:**
    In the `askComputerToMove` function, the engine is told how long to think. A longer time results in stronger moves.
    ```javascript
    // In the askComputerToMove function:
    this.stockfish.postMessage('go movetime 1500'); // Thinks for 1500ms (1.5 seconds)
    ```
    Increasing this value will make the AI stronger, while decreasing it will make it weaker and faster.

---

## 3. Accessing the Core Game Engine

The underlying `chess.js` instance is available at `window.ChessGame.game`. You can use this in your browser's developer console to interact with the engine directly.

For a full list of what you can do with the `chess.js` library (e.g., get move history, check whose turn it is, etc.), please refer to its official documentation.
