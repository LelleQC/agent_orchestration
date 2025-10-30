const game = require('./game');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function testCreateItems() {
    // Reset game state for test
    game.platforms.length = 0;
    game.items.length = 0;
    game.createPlatforms();
    game.createItems();

    assert(game.items.length > 0, "Items array should be populated");
    console.log("testCreateItems passed");
}

function testPlayerMovement() {
    // Test movePlayerLeft
    game.player.x = 100;
    game.movePlayerLeft();
    assert(game.player.x === 100 - game.config.playerMoveSpeed, "movePlayerLeft should decrease player.x");

    // Test movePlayerRight
    game.player.x = 100;
    game.movePlayerRight();
    assert(game.player.x === 100 + game.config.playerMoveSpeed, "movePlayerRight should increase player.x");

    // Test left boundary
    game.player.x = 0;
    game.movePlayerLeft();
    assert(game.player.x === 0, "movePlayerLeft should not go beyond left boundary");

    // Test right boundary
    game.player.x = game.config.canvasWidth - game.player.width;
    game.movePlayerRight();
    assert(game.player.x === game.config.canvasWidth - game.player.width, "movePlayerRight should not go beyond right boundary");

    console.log("testPlayerMovement passed");
}

function testPlatformGeneration() {
    game.platforms.length = 0; // Clear platforms for testing
    game.createPlatforms();

    assert(game.platforms.length === game.config.numPlatforms, "Should create the correct number of platforms");

    for (const platform of game.platforms) {
        assert(platform.x >= 0 && platform.x <= game.config.canvasWidth - platform.width, "Platform x should be within canvas bounds");
        assert(platform.y >= -game.config.canvasHeight && platform.y <= game.config.canvasHeight, "Platform y should be within a reasonable range");
        assert(platform.width === game.config.platformWidth, "Platform width should be correct");
        assert(platform.height === game.config.platformHeight, "Platform height should be correct");
    }
    console.log("testPlatformGeneration passed");
}

function testItemGeneration() {
    game.platforms.length = 0; // Clear platforms for testing
    game.items.length = 0; // Clear items for testing
    game.createPlatforms();
    game.createItems();

    // Since items are generated with a 30% chance, we can't assert a fixed number.
    // We can assert that if items are generated, they have correct properties.
    if (game.items.length > 0) {
        for (const item of game.items) {
            assert(item.x >= 0 && item.x <= game.config.canvasWidth - item.width, "Item x should be within canvas bounds");
            assert(item.y >= -game.config.canvasHeight && item.y <= game.config.canvasHeight, "Item y should be within a reasonable range");
            assert(item.width === 20, "Item width should be correct");
            assert(item.height === 20, "Item height should be correct");
            assert(item.type === 'spring', "Item type should be spring");

            // Check if item is on a platform (approximately)
            let isOnPlatform = false;
            for (const platform of game.platforms) {
                if (
                    item.x + item.width / 2 > platform.x &&
                    item.x + item.width / 2 < platform.x + platform.width &&
                    item.y + item.height > platform.y - 5 && // Small tolerance
                    item.y + item.height < platform.y + 5
                ) {
                    isOnPlatform = true;
                    break;
                }
            }
            assert(isOnPlatform, "Item should be generated on a platform");
        }
    }
    console.log("testItemGeneration passed");
}

function testCollisionDetection() {
    // Test colliding state
    const testPlayer = { x: 100, y: 100, width: 50, height: 50, dy: 1 };
    const testPlatform = { x: 90, y: 140, width: 80, height: 10 };
    assert(game.checkPlatformCollision(testPlayer, testPlatform), "Should detect collision when player is falling and on platform");

    // Test non-colliding state (player above platform)
    const testPlayer2 = { x: 100, y: 50, width: 50, height: 50, dy: 1 };
    const testPlatform2 = { x: 90, y: 140, width: 80, height: 10 };
    assert(!game.checkPlatformCollision(testPlayer2, testPlatform2), "Should not detect collision when player is above platform");

    // Test non-colliding state (player to the left of platform)
    const testPlayer3 = { x: 10, y: 100, width: 50, height: 50, dy: 1 };
    const testPlatform3 = { x: 90, y: 140, width: 80, height: 10 };
    assert(!game.checkPlatformCollision(testPlayer3, testPlatform3), "Should not detect collision when player is to the left of platform");

    // Test non-colliding state (player to the right of platform)
    const testPlayer4 = { x: 150, y: 100, width: 50, height: 50, dy: 1 };
    const testPlatform4 = { x: 90, y: 140, width: 80, height: 10 };
    assert(!game.checkPlatformCollision(testPlayer4, testPlatform4), "Should not detect collision when player is to the right of platform");

    // Test non-colliding state (player moving up)
    const testPlayer5 = { x: 100, y: 100, width: 50, height: 50, dy: -1 };
    const testPlatform5 = { x: 90, y: 140, width: 80, height: 10 };
    assert(!game.checkPlatformCollision(testPlayer5, testPlatform5), "Should not detect collision when player is moving up");

    console.log("testCollisionDetection passed");
}

function testScoring() {
    // Reset score for testing
    game.score = 0;
    game.player.y = game.config.canvasHeight / 2 - 10; // Player above scoring threshold
    const initialScore = game.score;
    const dy = -5; // Simulate upward movement
    game.updateScore(dy);
    assert(game.score === initialScore + Math.abs(dy), "Score should increase when player moves up");

    game.score = 0;
    game.player.y = game.config.canvasHeight / 2 + 10; // Player below scoring threshold
    const initialScore2 = game.score;
    const dy2 = -5; // Simulate upward movement
    game.updateScore(dy2);
    assert(game.score === initialScore2, "Score should not increase when player is below scoring threshold");

    console.log("testScoring passed");
}

function testGameOverCondition() {
    // Test game over when player falls off screen
    game.player.y = game.config.canvasHeight + 10; // Player below canvas
    assert(game.checkGameOver(), "Should return true when player falls off screen");

    // Test game not over when player is on screen
    game.gameOver = false; // Reset game over state
    game.player.y = game.config.canvasHeight / 2; // Player on screen
    assert(!game.checkGameOver(), "Should return false when player is on screen");

    console.log("testGameOverCondition passed");
}

// Run the test
try {
    testCreateItems();
    testPlayerMovement();
    testPlatformGeneration();
    testItemGeneration();
    testCollisionDetection();
    testScoring();
    testGameOverCondition();
} catch (e) {
    console.error(e.message);
}
