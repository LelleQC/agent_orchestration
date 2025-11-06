// Get the canvas and its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
window.ctx = ctx; // Expose for testing

// --- Game Constants ---
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const FRICTION = 0.8;
const JUMP_FORCE = 12;

// --- Game State ---
let score = 0;
let startTime = 0;
let gameTime = 0;
let timeBonus = 0;
let gameState = 'playing';
let highScore = 0;

const player = {
    x: 50,
    y: 0,
    width: 32,
    height: 48,
    dx: 0, // horizontal velocity
    dy: 0,  // vertical velocity
    onGround: false
};
window.player = player; // Expose for testing

const keys = {
    right: false,
    left: false,
    jump: false
};

const camera = {
    x: 0,
    y: 0
};
window.camera = camera; // Expose for testing

const level = {
    width: 32000 // The total width of the game world
};

const platforms = [];
window.platforms = platforms; // Expose for testing

const coins = [];

const enemies = [];

let goal = {};

function generateLevel() {
    // Ground floor
    platforms.push({ x: 0, y: 450, width: level.width, height: 30 });

    const segmentWidth = 400;
    const numSegments = level.width / segmentWidth;

    for (let i = 1; i < numSegments - 1; i++) { // Start at 1 to give player a safe start, end before goal
        const segmentX = i * segmentWidth;

        // Place a few platforms in each segment
        const numPlatforms = Math.floor(Math.random() * 3) + 2; // 2 to 4 platforms
        for (let j = 0; j < numPlatforms; j++) {
            const platX = segmentX + Math.random() * (segmentWidth - 150);
            const platY = 200 + Math.random() * 200; // Platforms in the middle-upper range
            const platWidth = 100 + Math.random() * 50;
            platforms.push({ x: platX, y: platY, width: platWidth, height: 20 });

            // Place a coin above the platform
            if (Math.random() > 0.5) { // 50% chance of a coin
                coins.push({ x: platX + platWidth / 2 - 8, y: platY - 30, width: 16, height: 16 });
            }
        }

        // Place an enemy in the segment
        if (Math.random() > 0.6) { // 40% chance of an enemy
            const enemyX = segmentX + Math.random() * (segmentWidth - 100);
            const enemyY = 420; // On the ground
            const patrolRange = 50 + Math.random() * 50;
            enemies.push({
                x: enemyX,
                y: enemyY,
                width: 30,
                height: 30,
                dx: 1,
                startX: enemyX - patrolRange,
                endX: enemyX + patrolRange
            });
        }
    }

    // Add the goal at the end
    goal = { x: level.width - 100, y: 350, width: 20, height: 100 };
}

// --- Level ---
function loadLevel() {
    // Clear existing platforms, coins, and enemies
    platforms.length = 0;
    coins.length = 0;
    enemies.length = 0;

    generateLevel();
}

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

/**
 * Updates the camera position based on the player's position.
 * @param {object} player - The player object.
 * @param {object} camera - The camera object.
 * @param {number} canvasWidth - The width of the canvas.
 * @param {number} levelWidth - The total width of the level.
 */
function updateCamera(player, camera, canvasWidth, levelWidth) {
    // Center the camera on the player
    let targetX = player.x + player.width / 2 - canvasWidth / 2;

    // Clamp the camera to the level boundaries
    if (targetX < 0) {
        targetX = 0;
    }
    if (targetX > levelWidth - canvasWidth) {
        targetX = levelWidth - canvasWidth;
    }

    camera.x = targetX;
}

/**
 * Updates the position of all enemies and handles their movement logic.
 */
function updateEnemies() {
    for (const enemy of enemies) {
        enemy.x += enemy.dx;
        if (enemy.x < enemy.startX || enemy.x + enemy.width > enemy.endX) {
            enemy.dx *= -1; // Reverse direction
        }
    }
}

/**
 * Handles collisions between the player and enemies.
 * @param {object} player - The player object.
 * @param {Array} enemies - The array of enemy objects.
 * @param {function} onScore - Callback function to update the score.
 */
function handleEnemyCollision(player, enemies, onScore) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        if (checkCollision(player, enemy)) {
            // Check if player is falling and lands on top of the enemy
            const isStomp = player.dy > 0 && player.y + player.height - player.dy < enemy.y;

            if (isStomp) {
                enemies.splice(i, 1); // Remove enemy
                player.dy = -JUMP_FORCE / 2; // Bounce
                onScore(50); // Add points
            } else {
                // Player hit the enemy from the side or bottom, reset position
                player.x = 50;
                player.y = 0;
                player.dx = 0;
                player.dy = 0;
            }
        }
    }
}

// --- Physics ---

/**
 * Checks for collision between two rectangular objects.
 * @param {object} rect1 - The first rectangle {x, y, width, height}.
 * @param {object} rect2 - The second rectangle {x, y, width, height}.
 * @returns {boolean} True if collision, false otherwise.
 */
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

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
    if (gameState !== 'playing') return;

    gameTime = (Date.now() - startTime) / 1000; // Time in seconds
    handleInput(keys, player);
    updateEnemies();
    
    // Apply physics to get potential new position
    const oldY = player.y;
    applyPhysics(player);

    // Update the camera
    updateCamera(player, camera, canvas.width, level.width);

    // Reset onGround status at the beginning of each update
    player.onGround = false;

    // Coin collision
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (checkCollision(player, coin)) {
            coins.splice(i, 1);
            score += 10;
        }
    }

    // Enemy collision
    handleEnemyCollision(player, enemies, (points) => { score += points; });

    // Goal collision
    if (checkCollision(player, goal)) {
        gameState = 'finished';
        const maxTime = 300; // Generous time in seconds
        timeBonus = Math.max(0, Math.floor((maxTime - gameTime) * 10));
        score += timeBonus;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('marioHighScore', highScore);
        }
    }

    // Collision detection with platforms
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // If player was above the platform and is now colliding (falling onto it)
            if (player.dy > 0 && oldY + player.height <= platform.y) {
                player.y = platform.y - player.height; // Snap to top of platform
                player.dy = 0; // Stop vertical movement
                player.onGround = true; // Player is on ground
            }
            // If player was below the platform and is now colliding (hitting head on it)
            else if (player.dy < 0 && oldY >= platform.y + platform.height) {
                player.y = platform.y + platform.height; // Snap to bottom of platform
                player.dy = 0; // Stop vertical movement
            }
        }
    }

    // Keep player within canvas bounds (simple for now)
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }
    if (player.y < 0) {
        player.y = 0;
        player.dy = 0;
    }
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > level.width) {
        player.x = level.width - player.width;
    }
}

/**
 * Draws all game elements on the canvas.
 */
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Start Camera --- 
    ctx.save(); // Save the default state
    ctx.translate(-camera.x, -camera.y); // Move the world

    // Draw the platforms
    ctx.fillStyle = '#86592d'; // Brown color for platforms
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw the coins
    ctx.fillStyle = '#ffd700'; // Gold color for coins
    for (const coin of coins) {
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw the enemies
    ctx.fillStyle = '#0000ff'; // Blue for enemies
    for (const enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Draw the goal
    ctx.fillStyle = '#00ff00'; // Green for the goal
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Draw the player
    // Body
    ctx.fillStyle = '#e60000'; // A slightly different red for the body
    ctx.fillRect(player.x, player.y + 16, player.width, player.height - 16);
    // Head
    ctx.fillStyle = '#ff8c69'; // A skin-tone color for the head
    ctx.fillRect(player.x + 4, player.y, player.width - 8, 16);

    // --- End Camera --- 
    ctx.restore(); // Restore to the default state (so UI elements aren't affected)

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Time: ${gameTime.toFixed(2)}`, 10, 50);

    if (gameState === 'finished') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = '20px Arial';
        ctx.fillText(`Time Bonus: ${timeBonus}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 60);
    }
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
 * Initializes the game state and level.
 */
function initGame() {
    loadLevel();
    highScore = parseInt(localStorage.getItem('marioHighScore')) || 0;
}

/**
 * Starts the game loop.
 */
function startGame() {
    startTime = Date.now();
    requestAnimationFrame(gameLoop);
}

// Set up and start the game
initGame();
startGame();
