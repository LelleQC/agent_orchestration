const puppeteer = require('puppeteer');

const URL = 'http://localhost:8888';

describe('Snake Game', () => {
    let browser;
    let page;

    // Increase timeout for all tests in this suite
    jest.setTimeout(30000);

    beforeAll(async () => {
        browser = await puppeteer.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        // Set a flag for the game to know it's in a test environment
        await page.evaluateOnNewDocument(() => { window.__IS_PUPPETEER__ = true; });
        await page.goto(URL, { waitUntil: 'networkidle0' });
        await page.evaluate(() => Game.init());
    });

    afterEach(async () => {
        await page.close();
    });

    test('should load the game correctly', async () => {
        const gameState = await page.evaluate(() => Game.getGameState());
        expect(gameState.score).toBe(0);
        expect(gameState.snake.length).toBe(1);
        expect(gameState.gameEnded).toBe(false);
    });

    test('should move the snake down', async () => {
        const initialGameState = await page.evaluate(() => Game.getGameState());
        const initialY = initialGameState.snake[0].y;

        await page.keyboard.press('ArrowDown');
        await page.evaluate(() => Game.tick());

        const newGameState = await page.evaluate(() => Game.getGameState());
        const gridSize = await page.evaluate(() => Game.gridSize);
        expect(newGameState.snake[0].y).toBe(initialY + gridSize);
    });

    test('should grow snake and increase score when food is eaten', async () => {
        const initialGameState = await page.evaluate(() => Game.getGameState());
        const initialSnakeLength = initialGameState.snake.length;
        const initialScore = initialGameState.score;
        const gridSize = await page.evaluate(() => Game.gridSize);

        // Place food directly in front of the snake
        const head = initialGameState.snake[0];
        await page.evaluate((x, y) => Game.placeFoodAt(x, y), head.x + gridSize, head.y);

        await page.evaluate(() => Game.tick()); // Move onto the food

        const newGameState = await page.evaluate(() => Game.getGameState());
        expect(newGameState.score).toBe(initialScore + 10);
        expect(newGameState.snake.length).toBe(initialSnakeLength + 1);
    });

    test('should end the game on wall collision', async () => {
        const gridSize = await page.evaluate(() => Game.gridSize);
        const canvasSize = await page.evaluate(() => Game.canvasSize);

        // Move snake to the far right edge
        await page.evaluate((gridSize, canvasSize) => {
            Game.snake = [{ x: canvasSize - gridSize, y: 10 * gridSize }];
            Game.direction = 'right';
        }, gridSize, canvasSize);

        await page.evaluate(() => Game.tick()); // This tick will cause the collision

        const gameState = await page.evaluate(() => Game.getGameState());
        expect(gameState.gameEnded).toBe(true);
    });
});