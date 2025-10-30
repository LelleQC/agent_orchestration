const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = require('./game');

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
    if (game.checkGameOver()) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', game.config.canvasWidth / 2 - 100, game.config.canvasHeight / 2);
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, game.config.canvasWidth, game.config.canvasHeight);

    // Handle horizontal movement
    if (rightPressed) {
        game.movePlayerRight();
    } else if (leftPressed) {
        game.movePlayerLeft();
    }

    // Apply gravity and update player position
    game.updatePlayerPosition();

    // Camera follow and score
    if (game.player.y < game.config.canvasHeight / 2) {
        for (let i = 0; i < game.platforms.length; i++) {
            game.platforms[i].y -= game.player.dy;
            if (game.platforms[i].y > game.config.canvasHeight) {
                game.platforms.splice(i, 1);
                game.updateScore(game.player.dy);
                game.platforms.push({
                    x: Math.random() * (game.config.canvasWidth - game.config.platformWidth),
                    y: 0,
                    width: game.config.platformWidth,
                    height: game.config.platformHeight
                });
            }
        }
        for (let i = 0; i < game.items.length; i++) {
            game.items[i].y -= game.player.dy;
            if (game.items[i].y > game.config.canvasHeight) {
                game.items.splice(i, 1);
            }
        }
        game.player.y -= game.player.dy;
    }

    // Game over condition
    if (game.player.y > game.config.canvasHeight) {
        gameOver = true;
    }

    // Platform collision detection
    for (const platform of game.platforms) {
        if (game.checkPlatformCollision(game.player, platform)) {
            game.player.dy = game.player.jumpForce;
        }
    }

    // Item collision detection
    for (let i = 0; i < game.items.length; i++) {
        const item = game.items[i];
        if (
            game.player.x < item.x + item.width &&
            game.player.x + game.player.width > item.x &&
            game.player.y < item.y + item.height &&
            game.player.y + game.player.height > item.y
        ) {
            if (item.type === 'spring') {
                game.player.dy = game.player.jumpForce * 1.5; // Higher jump for spring
                game.items.splice(i, 1); // Remove item after use
                i--; // Adjust index after removing item
            }
        }
    }

    drawPlatforms();
    drawItems();
    drawPlayer();
    drawScore();

    animationFrameId = requestAnimationFrame(gameLoop);
}

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

    if (diffX > 0) {
        rightPressed = true;
        leftPressed = false;
    } else if (diffX < 0) {
        leftPressed = true;
        rightPressed = false;
    } else {
        rightPressed = false;
        leftPressed = false;
    }
});

canvas.addEventListener('touchend', () => {
    rightPressed = false;
    leftPressed = false;
});

game.createPlatforms();
game.createItems();
gameLoop();
