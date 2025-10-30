// Get the canvas and its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Constants ---
const GRAVITY = 0.5;

// --- Game State ---
const player = {
    x: 50,
    y: 0,
    width: 32,
    height: 48,
    dx: 0, // horizontal velocity
    dy: 0  // vertical velocity
};

/**
 * Applies physics (like gravity) to a game object.
 * @param {object} obj - The game object (e.g., player).
 * @returns {object} The new state of the object.
 */
function applyPhysics(obj) {
    // Apply gravity
    obj.dy += GRAVITY;
    // Update position
    obj.y += obj.dy;
    obj.x += obj.dx;
    
    // Return a copy of the new state for testing purposes
    return { ...obj };
}

/**
 * Updates the entire game state for one frame.
 */
function update() {
    applyPhysics(player);
}

/**
 * Draws all game elements on the canvas.
 */
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = 'red'; // Mario-like color
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * The main game loop. This function is called repeatedly to update the game state and redraw the canvas.
 */
function gameLoop() {
    // 1. Update game state
    update();

    // 2. Draw game elements
    draw();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

/**
 * Initializes the game.
 */
function init() {
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
init();
