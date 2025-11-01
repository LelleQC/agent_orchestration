window.addEventListener('load', function() {
    console.log("Running tests...");

    const resultsDiv = document.getElementById('results');
    let testCount = 0;
    let passCount = 0;

    function test(description, testFn) {
        testCount++;
        try {
            testFn();
            passCount++;
            resultsDiv.innerHTML += `<p class="pass">PASS: ${description}</p>`;
            console.log(`PASS: ${description}`);
        } catch (e) {
            resultsDiv.innerHTML += `<p class="fail">FAIL: ${description}</p>`;
            resultsDiv.innerHTML += `<pre>${e.stack}</pre>`;
            console.error(`FAIL: ${description}`);
            console.error(e);
        }
    }

    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ${message}. Expected ${expected} but got ${actual}.`);
        }
    }

    // --- Tests will be added here ---

    test("Player should have an initial upward velocity after game start", function() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const game = new Game(ctx, canvas.width, canvas.height);

        const initialState = game.getGameState();

        // In canvas, a negative Y speed means moving upwards.
        // This test is expected to FAIL initially, because we have temporarily disabled the initial jump.
        assertEquals(initialState.player.speedY, game.jumpStrength, "Player's initial speedY should be equal to the game's jumpStrength");
    });

    console.log(`${passCount}/${testCount} tests passed.`);
});