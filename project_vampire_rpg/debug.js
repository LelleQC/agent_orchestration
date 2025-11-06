const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Browser CONSOLE ERROR:', msg.text());
        }
    });

    await page.goto(`file://${path.join(__dirname, 'index.html')}`);

    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await page.screenshot({ path: 'screenshot.png' });

    await browser.close();
})();
