const config = {
    canvasWidth: 400,
    canvasHeight: 600,
    platformWidth: 80,
    platformHeight: 10,
    numPlatforms: 10,
    playerWidth: 50,
    playerHeight: 50,
    gravity: 0.5,
    jumpForce: -12,
    playerInitialX: 200 - 25,
    playerInitialY: 550,
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
            y: config.canvasHeight - 100 - i * 70,
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

module.exports = {
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