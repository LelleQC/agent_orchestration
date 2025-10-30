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
    playerInitialY: 600 - 50,
    playerMoveSpeed: 7,
};

const player = {
    x: config.playerInitialX,
    y: config.playerInitialY,
    width: config.playerWidth,
    height: config.playerHeight,
    dx: 0,
    dy: 0,
    gravity: config.gravity,
    jumpForce: config.jumpForce,
    isJumping: false
};

let score = 0;

const platforms = [];
const items = [];

function createPlatforms() {
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
    player.dy += player.gravity;
    player.y += player.dy;

    // Prevent falling through the floor
    if (player.y + player.height > config.canvasHeight) {
        player.y = config.canvasHeight - player.height;
        player.dy = 0;
        player.isJumping = false;
    }
}

function checkPlatformCollision(player, platform) {
    return (
        player.dy > 0 &&
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height
    );
}

function updateScore(dy) {
    if (player.y < config.canvasHeight / 2) {
        score += Math.abs(dy);
    }
}

let gameOver = false;

function checkGameOver() {
    if (player.y > config.canvasHeight) {
        gameOver = true;
    }
    return gameOver;
}

module.exports = {
    config,
    player,
    platforms,
    items,
    score,
    gameOver,
    createPlatforms,
    createItems,
    movePlayerLeft,
    movePlayerRight,
    updatePlayerPosition,
    checkPlatformCollision,
    updateScore,
    checkGameOver
};
