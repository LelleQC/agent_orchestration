let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function displayResult(testName, status, error = null) {
    const resultsDiv = document.getElementById('test-results');
    if (!resultsDiv) {
        console.error('Test results div not found!');
        return;
    }

    const testDiv = document.createElement('div');
    testDiv.classList.add('test-item');

    if (status === 'PASS') {
        testDiv.classList.add('test-pass');
        testDiv.innerHTML = `✔ PASS: ${testName}`;
    } else {
        testDiv.classList.add('test-fail');
        testDiv.innerHTML = `✖ FAIL: ${testName}<br><pre>${error ? error.message : 'Unknown error'}</pre>`;
    }
    resultsDiv.appendChild(testDiv);
}

function runTest(testName, testFunction) {
    totalTests++;
    try {
        testFunction();
        passedTests++;
        displayResult(testName, 'PASS');
    } catch (error) {
        failedTests++;
        displayResult(testName, 'FAIL', error);
    }
}

runTest("Player should be affected by gravity", () => {
    // Setup: Create a mock player object at a specific state
    const testPlayer = {
        x: 50,
        y: 0,
        width: 32,
        height: 48,
        dx: 0,
        dy: 0 // Not moving vertically initially
    };

    // Action: Apply one step of the physics update
    // This function does not exist yet in game.js, so this will fail.
    const newPlayerState = applyPhysics(testPlayer);

    // Assertion: Check if vertical velocity has changed due to gravity
    if (newPlayerState.dy <= 0) {
        throw new Error(`Player vertical velocity (dy) should be > 0 after gravity is applied, but it was ${newPlayerState.dy}`);
    }
    
    // Assertion: Check if y position has changed
    if (newPlayerState.y <= 0) {
        throw new Error(`Player y position should increase after gravity is applied, but it was ${newPlayerState.y}`);
    }
});

runTest("Player should move left and right based on input", () => {
    // Setup
    const testPlayer = { x: 100, y: 0, dx: 0, dy: 0 };
    const inputs = { left: false, right: false };

    // Action 1: Simulate pressing 'right'
    inputs.right = true;
    // This function doesn't exist yet, so it will fail
    handleInput(inputs, testPlayer); 
    
    // Assertion 1
    if (testPlayer.dx <= 0) {
        throw new Error(`Player dx should be > 0 when right is pressed, but was ${testPlayer.dx}`);
    }

    // Action 2: Simulate pressing 'left'
    inputs.right = false;
    inputs.left = true;
    handleInput(inputs, testPlayer);

    // Assertion 2
    if (testPlayer.dx >= 0) {
        throw new Error(`Player dx should be < 0 when left is pressed, but was ${testPlayer.dx}`);
    }
});

runTest("Player should jump when on the ground and jump key is pressed", () => {
    // Setup
    const testPlayer = { x: 100, y: 200, dx: 0, dy: 0, onGround: true };
    const inputs = { left: false, right: false, jump: false };

    // Action: Simulate pressing 'jump'
    inputs.jump = true;
    handleInput(inputs, testPlayer); 
    
    // Assertion
    if (testPlayer.dy >= 0) {
        throw new Error(`Player dy should be < 0 when jump is pressed, but was ${testPlayer.dy}`);
    }

    // Test that player cannot double-jump
    testPlayer.onGround = false;
    testPlayer.dy = -5; // reset dy to a jumping value
    handleInput(inputs, testPlayer);

    if (testPlayer.dy > -5) {
        throw new Error(`Player should not be able to jump again in mid-air.`);
    }
});

runTest("Level should initialize with platforms", () => {
    // Setup
    // This function will be added to game.js to set up the level
    initGame(); 

    // Assertion
    if (typeof platforms === 'undefined' || platforms.length === 0) {
        throw new Error("The 'platforms' array should be initialized and contain level data.");
    }
});

runTest("Player should land on a platform", () => {
    // Setup: Player slightly above a platform, falling
    const testPlayer = { x: 100, y: 100, width: 32, height: 48, dx: 0, dy: 5, onGround: false };
    const testPlatforms = [{ x: 50, y: 140, width: 100, height: 20 }]; // Platform below player

    // Action: Simulate one update cycle (physics + collision)
    // We need a way to call the collision logic from game.js
    // For now, this test will fail because collision logic is not integrated into update()
    // and checkCollision function doesn't exist yet.
    const updatedPlayer = applyPhysics(testPlayer); // This will update y and dy
    // Assume a collision function exists and is called within update() or separately
    // For the test, we'll manually check the expected outcome after collision
    // This is a placeholder for when the actual collision function is available.

    // Assertion: Player should be on the platform and onGround should be true
    // This assertion will initially fail as collision logic is missing.
    // Expected: player.y should be platform.y - player.height, and onGround = true, dy = 0
    // Since we don't have the collision function yet, we'll assert on the expected state
    // after a hypothetical collision.
    if (updatedPlayer.y + updatedPlayer.height > testPlatforms[0].y && updatedPlayer.y < testPlatforms[0].y + testPlatforms[0].height) {
        // If player is overlapping, assume collision logic would adjust
        // For now, we'll just check if it's still falling or if it's "on" the platform
        // This test is designed to fail until collision logic is implemented.
        throw new Error("Collision logic not implemented: Player should have landed on the platform.");
    }
});

runTest("Player should not fall through a platform", () => {
    // Setup: Player falling from above a platform
    const testPlayer = { x: 100, y: 50, width: 32, height: 48, dx: 0, dy: 10, onGround: false };
    const testPlatforms = [{ x: 50, y: 100, width: 100, height: 20 }]; // Platform below player

    // Action: Simulate one update cycle
    const updatedPlayer = applyPhysics(testPlayer);

    // Assertion: Player's bottom should not be below the platform's top if collision occurred
    // This test is designed to fail until collision logic is implemented.
    if (updatedPlayer.y + updatedPlayer.height > testPlatforms[0].y) {
        throw new Error("Collision logic not implemented: Player fell through the platform.");
    }
});

runTest("Player should not be able to double jump", () => {
    // Setup: Player in mid-air (not on ground)
    const testPlayer = { x: 100, y: 100, width: 32, height: 48, dx: 0, dy: -5, onGround: false };
    const inputs = { left: false, right: false, jump: true }; // Attempting to jump

    // Action: Apply input
    handleInput(inputs, testPlayer);

    // Assertion: dy should not change to a new jump force if not on ground
    // This test already exists in a simpler form, but this reinforces the onGround check.
    if (testPlayer.dy < -5) { // If dy became more negative, a double jump occurred
        throw new Error("Player performed a double jump when not on ground.");
    }
});

runTest("Camera should follow the player horizontally", () => {
    // Setup
    const testPlayer = { x: 450, width: 50 };
    const camera = { x: 0, y: 0 };
    const canvasWidth = 800;
    const level = { width: 1600 }; // Level is twice the canvas width

    // Action: Update camera based on player position
    // This function doesn't exist yet, so this will fail.
    updateCamera(testPlayer, camera, canvasWidth, level.width);

    // Assertion 1: Camera should have moved to keep player centered
    // Expected: camera.x = 450 - 800 / 2 = 50
    if (camera.x !== 50) {
        throw new Error(`Camera should have moved to center the player. Expected x=50, but got ${camera.x}`);
    }

    // Setup 2: Player is near the start of the level
    testPlayer.x = 100;

    // Action 2: Update camera
    updateCamera(testPlayer, camera, canvasWidth, level.width);

    // Assertion 2: Camera should not scroll past the left edge (x=0)
    if (camera.x !== 0) {
        throw new Error(`Camera should not scroll left of the level start. Expected x=0, but got ${camera.x}`);
    }

    // Setup 3: Player is near the end of the level
    testPlayer.x = 1500;

    // Action 3: Update camera
    updateCamera(testPlayer, camera, canvasWidth, level.width);

    // Assertion 3: Camera should not scroll past the right edge
    // Max camera.x = level.width - canvas.width = 1600 - 800 = 800
    if (camera.x !== 800) {
        throw new Error(`Camera should not scroll right of the level end. Expected x=800, but got ${camera.x}`);
    }
});

runTest("Drawing should be offset by camera position", () => {
    // Setup: Create a mock context to track calls
    const mockCtx = {
        calls: [],
        clearRect: function() { this.calls.push({ func: 'clearRect', args: arguments }); },
        save: function() { this.calls.push({ func: 'save' }); },
        translate: function(x, y) { this.calls.push({ func: 'translate', args: { x, y } }); },
        fillRect: function(x, y, w, h) { this.calls.push({ func: 'fillRect', args: { x, y, w, h } }); },
        restore: function() { this.calls.push({ func: 'restore' }); },
    };

    // Setup game state
    const testPlayer = { x: 500, y: 100, width: 50, height: 50 };
    const testPlatforms = [{ x: 480, y: 200, width: 100, height: 20 }];
    const testCamera = { x: 400, y: 0 };

    // Temporarily replace global objects for the test
    const originalCtx = window.ctx;
    const originalPlayer = window.player;
    const originalPlatforms = window.platforms;
    const originalCamera = window.camera;
    window.ctx = mockCtx;
    window.player = testPlayer;
    window.platforms = testPlatforms;
    window.camera = testCamera;

    // Action
    draw();

    // Assertions
    const translateCall = mockCtx.calls.find(c => c.func === 'translate');
    if (!translateCall || translateCall.args.x !== -400 || translateCall.args.y !== 0) {
        throw new Error(`ctx.translate was not called with the correct camera offset. Expected (-400, 0), got ${JSON.stringify(translateCall.args)}`);
    }

    const playerRectCall = mockCtx.calls.find(c => c.func === 'fillRect' && c.args.x === 500);
    if (!playerRectCall) {
        throw new Error(`Player was not drawn at its correct world position.`);
    }

    // Cleanup
    window.ctx = originalCtx;
    window.player = originalPlayer;
    window.platforms = originalPlatforms;
    window.camera = originalCamera;
});

runTest("Player should collide with a coin", () => {
    // Setup
    const testPlayer = { x: 100, y: 100, width: 32, height: 48 };
    const testCoin = { x: 110, y: 110, width: 16, height: 16 }; // Positioned to collide

    // Action
    const collision = checkCollision(testPlayer, testCoin);

    // Assertion
    if (!collision) {
        throw new Error("Player should have collided with the coin, but checkCollision returned false.");
    }
});

runTest("Player should collide with an enemy from the side", () => {
    // Setup
    const testPlayer = { x: 100, y: 100, width: 32, height: 48 };
    const testEnemy = { x: 120, y: 100, width: 30, height: 30 }; // Positioned for side collision

    // Action
    const collision = checkCollision(testPlayer, testEnemy);

    // Assertion
    if (!collision) {
        throw new Error("Player should have collided with the enemy, but checkCollision returned false.");
    }
});

runTest("Player should defeat an enemy by jumping on it", () => {
    // Setup
    const testPlayer = { x: 100, y: 80, width: 32, height: 48, dy: 5 }; // Player is above and falling
    const testEnemies = [{ x: 100, y: 120, width: 30, height: 30 }];
    let testScore = 0;

    // Action: This function doesn't exist yet, so it will fail.
    // It should handle the collision, modify the enemies array, player state, and score.
    handleEnemyCollision(testPlayer, testEnemies, (points) => { testScore += points; });

    // Assertions
    if (testEnemies.length !== 0) {
        throw new Error(`Enemy should have been removed from the array. Enemies left: ${testEnemies.length}`);
    }
    if (testPlayer.dy >= 0) {
        throw new Error(`Player should have bounced upwards (negative dy), but dy is ${testPlayer.dy}`);
    }
    if (testScore === 0) {
        throw new Error(`Score should have increased after defeating an enemy.`);
    }
});

runTest("Player should collide with the goal", () => {
    // Setup
    const testPlayer = { x: 100, y: 100, width: 32, height: 48 };
    const testGoal = { x: 110, y: 100, width: 20, height: 100 }; // Positioned for collision

    // Action
    const collision = checkCollision(testPlayer, testGoal);

    // Assertion
    if (!collision) {
        throw new Error("Player should have collided with the goal, but checkCollision returned false.");
    }
});


// Note: Horizontal collision tests will be added once basic vertical collision is working,
// as they often depend on the same underlying collision detection utility.
// For now, focusing on vertical (landing) and jump mechanics.

document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('test-results');
    if (resultsDiv) {
        const summaryDiv = document.createElement('div');
        summaryDiv.classList.add('test-summary');
        summaryDiv.innerHTML = `
            <h3>Test Summary:</h3>
            <p>Total: ${totalTests}</p>
            <p class="pass">Passed: ${passedTests}</p>
            <p class="fail">Failed: ${failedTests}</p>
        `;
        resultsDiv.appendChild(summaryDiv);
    }
});