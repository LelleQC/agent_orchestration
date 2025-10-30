# Meta-Learnings: Snake Game

This document contains technical learnings specific to the Snake Game project.

---

## Learnings from Automated Testing

This section details the key challenges and solutions encountered during the creation of an automated test suite for the browser-based Snake game.

### 1. Challenge: Test Infrastructure Conflicts

**Problem:** The initial tests failed consistently with `EADDRINUSE` (Address Already in Use) and `EACCES` (Permission Denied) errors. The test script was responsible for starting and stopping its own web server, but it failed to shut down cleanly between test runs, leading to port conflicts.

**Solution:** The responsibility for managing the test server was decoupled from the test script itself.

1.  **Externalize Server Management:** The `start-server-and-test` npm package was introduced. This tool handles the lifecycle of the server: it starts the server, waits for it to be ready, runs the tests, and then reliably shuts the server down.
2.  **Avoid Port Conflicts:** The port was changed from the common `8080` to `8888` to reduce the likelihood of conflicts with other services on the machine.

**Key Takeaway:** Test infrastructure (like web servers) should be managed by dedicated tools, separate from the test execution logic, to ensure a clean and reliable environment for every test run.

---

### 2. Challenge: Race Condition with Game Loop

**Problem:** A test for snake movement failed because the snake moved twice as far as expected. The test manually advanced the game by one step (`tick()`), but the game's own real-time `setInterval` loop was also running in the background, causing a second, unpredictable `tick()`.

**Solution:** The game code was modified to allow the test environment to have full control over the game's execution.

1.  **Isolate the Game Loop:** A global flag (`window.__IS_PUPPETEER__`) is now set by the test script before the game loads.
2.  **Conditional Execution:** The game script (`script.js`) checks for this flag. If the flag is present, it does **not** start the automatic `setInterval` loop. This allows the test script to be the sole driver of the game's state by calling `tick()` manually and predictably.

**Key Takeaway:** Real-time or asynchronous processes in an application are a major source of flakiness in automated tests. The application should be designed for testability, allowing tests to disable these features and take deterministic control.
