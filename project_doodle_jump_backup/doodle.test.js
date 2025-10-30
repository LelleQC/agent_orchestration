const assert = require('assert');
const game = require('./game');

function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✔ ${testName}`);
    } catch (error) {
        console.error(`✖ ${testName}`);
        console.error(error);
        process.exit(1);
    }
}

runTest('Player moves left correctly', () => {
    game.init();
    const initialX = game.player.x;
    game.movePlayerLeft();
    assert.strictEqual(game.player.x, initialX - game.config.playerMoveSpeed);
});

runTest('Player moves right correctly', () => {
    game.init();
    const initialX = game.player.x;
    game.movePlayerRight();
    assert.strictEqual(game.player.x, initialX + game.config.playerMoveSpeed);
});

runTest('Player is affected by gravity', () => {
    game.init();
    const initialY = game.player.y;
    const initialDY = game.player.dy;
    game.updatePlayerPosition();
    assert.strictEqual(game.player.dy, initialDY + game.config.gravity);
    assert.strictEqual(game.player.y, initialY + game.player.dy);
});

runTest('Player collides with a platform', () => {
    game.init();
    game.player.y = 590; // Player is just above the platform
    game.player.dy = 10;   // Player is falling
    game.platforms.length = 0;
    game.platforms.push({ x: game.player.x, y: 600 - 5, width: game.player.width, height: 10 });

    game.updatePlayerPosition(); // Player y becomes 590 + 10.5 = 600.5
    
    // Manually check collision condition from game.js
    const player = game.player;
    const platform = game.platforms[0];
    const collides = player.dy > 0 &&
                     player.x < platform.x + platform.width &&
                     player.x + player.width > platform.x &&
                     player.y + player.height > platform.y &&
                     player.y + player.height < platform.y + platform.height;

    // Now call the function
    game.checkPlatformCollision();

    assert.strictEqual(game.player.dy, game.config.jumpForce, "Player should jump upon collision");
});

runTest('Player collides with a spring item', () => {
    game.init();
    game.items.length = 0;
    game.items.push({ x: game.player.x, y: game.player.y, width: 20, height: 20, type: 'spring' });
    game.checkItemCollision();
    assert.strictEqual(game.player.dy, game.config.jumpForce * 1.5);
    assert.strictEqual(game.items.length, 0); // Item should be removed
});

runTest('Game over condition is met', () => {
    game.init();
    game.player.y = game.config.canvasHeight + 1;
    assert.strictEqual(game.checkGameOver(), true);
});

console.log('\nAll tests passed!');