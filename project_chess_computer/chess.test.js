const puppeteer = require('puppeteer');

const URL = 'http://localhost:8888'; // Using the same port as before to avoid issues

describe('Chess Game', () => {
    let browser;
    let page;

    jest.setTimeout(30000);

    beforeAll(async () => {
        browser = await puppeteer.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.evaluateOnNewDocument(() => { window.__IS_PUPPETEER__ = true; });
        await page.goto(URL, { waitUntil: 'networkidle0' });
        await page.evaluate(() => ChessGame.init());
    });

    afterEach(async () => {
        await page.close();
    });

    test('should load the initial board state', async () => {
        const gameState = await page.evaluate(() => ChessGame.getGameState());
        expect(gameState.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(gameState.turn).toBe('w');
    });

    test('should perform a legal move for White', async () => {
        await page.click('[data-square="e2"]');
        await page.click('[data-square="e4"]');

        const gameState = await page.evaluate(() => ChessGame.getGameState());
        expect(gameState.fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
        expect(gameState.turn).toBe('b');
    });

    test('should reject an illegal move', async () => {
        const initialFen = await page.evaluate(() => ChessGame.getGameState().fen);

        // Try to move a pawn backwards
        await page.click('[data-square="e2"]');
        await page.click('[data-square="e1"]');

        const gameState = await page.evaluate(() => ChessGame.getGameState());
        expect(gameState.fen).toBe(initialFen);
        expect(gameState.turn).toBe('w');
    });

    test('should allow the computer to make a move after a player move', async () => {
        // Player makes a move
        await page.click('[data-square="e2"]');
        await page.click('[data-square="e4"]');
        const playerMoveFen = await page.evaluate(() => ChessGame.getGameState().fen);

        // Manually trigger computer's turn
        await page.evaluate(() => ChessGame.makeComputerMove());

        const computerMoveFen = await page.evaluate(() => ChessGame.getGameState().fen);
        const gameState = await page.evaluate(() => ChessGame.getGameState());

        expect(computerMoveFen).not.toBe(playerMoveFen);
        expect(gameState.turn).toBe('w');
    });
});
