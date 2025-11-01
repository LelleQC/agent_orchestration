// --- Start of combined game.js content ---
const config = {
    canvasWidth: 400,
    canvasHeight: 600,
    platformWidth: 80,
    platformHeight: 10,
    numPlatforms: 10,
    playerWidth: 50,
    playerHeight: 50,
    gravity: 0.5,
    jumpForce: -24,
    playerInitialX: 200 - 25,
    playerInitialY: 400,
    playerMoveSpeed: 7,
};

const player = {
    x: config.playerInitialX,
    y: config.playerInitialY,
    width: config.playerWidth,
    height: config.playerHeight,
    dx: 0,
    dy: 0,
    isJumping: false
};

let score = 0;
let gameOver = false;

const platforms = [];
const items = [];

function createPlatforms() {
    platforms.length = 0; // Clear existing platforms
    for (let i = 0; i < config.numPlatforms; i++) {
        platforms.push({
            x: Math.random() * (config.canvasWidth - config.platformWidth),
            y: config.playerInitialY + player.height - (i * 70) - 20,
            width: config.platformWidth,
            height: config.platformHeight
        });
    }
}

function createItems() {
    items.length = 0; // Clear existing items
    for (const platform of platforms) {
        if (Math.random() < 0.3) { // 30% chance to have an item
            items.push({
                x: platform.x + platform.width / 2 - 10,
                y: platform.y - 20,
                width: 20,
                height: 20,
                type: 'spring'
            });
        }
    }
}

function movePlayerLeft() {
    player.x -= config.playerMoveSpeed;
    if (player.x < 0) {
        player.x = 0;
    }
}

function movePlayerRight() {
    player.x += config.playerMoveSpeed;
    if (player.x > config.canvasWidth - player.width) {
        player.x = config.canvasWidth - player.width;
    }
}

function updatePlayerPosition() {
    player.dy += config.gravity;
    player.y += player.dy;
}

function checkPlatformCollision() {
    for (const platform of platforms) {
        if (
            player.dy > 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.dy = config.jumpForce;
            return; // Exit after one collision
        }
    }
}

function checkItemCollision() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            if (item.type === 'spring') {
                player.dy = config.jumpForce * 1.5; // Higher jump
                items.splice(i, 1); // Remove item
                i--;
            }
        }
    }
}


function updateScore(dy) {
    // Score increases as player moves up
    if (dy < 0) {
        score += Math.floor(Math.abs(dy));
    }
}

function checkGameOver() {
    if (player.y > config.canvasHeight) {
        gameOver = true;
    }
    return gameOver;
}

function init() {
    player.x = config.playerInitialX;
    player.y = config.playerInitialY;
    player.dx = 0;
    player.dy = 0;
    score = 0;
    gameOver = false;
    createPlatforms();
    createItems();
}

// --- End of combined game.js content ---

// Create a 'game' object to hold all the game logic, to avoid breaking script.js
const game = {
    config,
    player,
    platforms,
    items,
    score,
    gameOver,
    init,
    movePlayerLeft,
    movePlayerRight,
    updatePlayerPosition,
    checkPlatformCollision,
    checkItemCollision,
    updateScore,
    checkGameOver
};


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let rightPressed = false;
let leftPressed = false;
let animationFrameId;

function drawPlatforms() {
    ctx.fillStyle = 'blue';
    for (const platform of game.platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function drawItems() {
    ctx.fillStyle = 'red';
    for (const item of game.items) {
        ctx.fillRect(item.x, item.y, item.width, item.height);
    }
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${game.score}`, 10, 30);
}

function gameLoop() {
    // Check for game over first
    if (game.checkGameOver()) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', game.config.canvasWidth / 2 - 100, game.config.canvasHeight / 2);
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, game.config.canvasWidth, game.config.canvasHeight);

    // Handle input
    if (rightPressed) {
        game.movePlayerRight();
    } else if (leftPressed) {
        game.movePlayerLeft();
    }

    // Update game state
    game.updatePlayerPosition();
    game.checkPlatformCollision();
    game.checkItemCollision();

    // Camera movement and scoring
    const player = game.player;
    const config = game.config;
    if (player.y < config.canvasHeight / 2) {
        const dy = player.dy;
        // Move platforms and items down
        game.platforms.forEach(p => { p.y -= dy; });
        game.items.forEach(i => { i.y -= dy; });
        // Keep player in the middle
        player.y -= dy;
        game.updateScore(dy);

        // Remove old platforms and add new ones
        for (let i = game.platforms.length - 1; i >= 0; i--) {
            if (game.platforms[i].y > config.canvasHeight) {
                game.platforms.splice(i, 1);
                game.platforms.push({
                    x: Math.random() * (config.canvasWidth - config.platformWidth),
                    y: 0,
                    width: config.platformWidth,
                    height: config.platformHeight
                });
            }
        }
    }

    // Draw everything
    drawPlatforms();
    drawItems();
    drawPlayer();
    drawScore();

    // Request next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        rightPressed = true;
    } else if (e.code === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') {
        rightPressed = false;
    } else if (e.code === 'ArrowLeft') {
        leftPressed = false;
    }
});

let touchStartX = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;

    if (diffX > 5) { // Added a small threshold
        rightPressed = true;
        leftPressed = false;
    } else if (diffX < -5) { // Added a small threshold
        leftPressed = true;
        rightPressed = false;
    }
});

canvas.addEventListener('touchend', () => {
    rightPressed = false;
    leftPressed = false;
    touchStartX = 0;
});

// Initialize and start the game
game.init();
game.player.dy = game.config.jumpForce; // Give the player an initial jump
gameLoop();
