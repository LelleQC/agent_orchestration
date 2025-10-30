console.log("Running tests...");

function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✔ PASS: ${testName}`);
    } catch (error) {
        console.error(`✖ FAIL: ${testName}`);
        console.error(error);
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

console.log("Tests finished.");
