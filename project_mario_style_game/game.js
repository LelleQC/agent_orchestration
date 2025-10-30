// Get the canvas and its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Constants ---
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const FRICTION = 0.8;
const JUMP_FORCE = 12;

// --- Game State ---
const player = {
    x: 50,
    y: 0,
    width: 32,
    height: 48,
    dx: 0, // horizontal velocity
    dy: 0,  // vertical velocity
    onGround: false
};

const keys = {
    right: false,
    left: false,
    jump: false
};

// --- Input Handling ---
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'Space') keys.jump = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'Space') keys.jump = false;
});

/**
 * Handles player input to change player velocity.
 * @param {object} inputState - The state of the keys.
 * @param {object} p - The player object.
 */
function handleInput(inputState, p) {
    // Horizontal movement
    if (inputState.right) {
        p.dx = PLAYER_SPEED;
    } else if (inputState.left) {
        p.dx = -PLAYER_SPEED;
    } else {
        p.dx *= FRICTION; // Apply friction when no key is pressed
    }

    // Vertical movement (jumping)
    if (inputState.jump && p.onGround) {
        p.dy = -JUMP_FORCE;
        p.onGround = false;
    }
}

// --- Physics ---

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

// --- Main Loop ---

/**
 * Updates the entire game state for one frame.
 */
function update() {
    handleInput(keys, player);
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
