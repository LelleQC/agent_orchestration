# Doodle Jump Ultimate Developer Guide

This guide provides a technical overview of the Doodle Jump Ultimate codebase.

## File Structure

*   `index.html`: The main HTML file that contains the game canvas.
*   `style.css`: The CSS file for styling the game.
*   `script.js`: The main JavaScript file that contains the game logic.
*   `character.svg`: The SVG image for the player character.
*   `platform.svg`: The SVG image for the platforms.
*   `background-layer-1.svg`: The SVG image for the first background layer.
*   `background-layer-2.svg`: The SVG image for the second background layer.
*   `background-layer-3.svg`: The SVG image for the third background layer.

## Code Structure

The `script.js` file is organized into the following classes:

*   `Layer`: Represents a single background layer for parallax scrolling.
*   `Background`: Manages the background layers.
*   `InputHandler`: Handles keyboard input.
*   `Player`: Represents the player character.
*   `Particle`: Represents a single particle for visual effects.
*   `Sound`: Handles sound effects using the Web Audio API.
*   `Platform`: Represents a single platform.
*   `Game`: The main game class that ties everything together.

## How to Modify

To modify the game, you can edit the `script.js` file. For example, to change the player's jump strength, you can modify the `jumpStrength` property in the `Game` class.

To change the graphics, you can edit the SVG files.
