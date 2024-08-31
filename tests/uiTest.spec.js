const {test, expect} = require('@playwright/test');

test('First test without context', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // await expect(page).toHaveTitle(/Playwright/);
    // await page.click('text=Get started');
    // await expect(page).toHaveSelector('h1:has-text("Installation")');
});


test.only('Test with context', async ({browser}) => {

    // This opens a new browser context with plugins/ cookies/ proxies
    const context = await browser.newContext();

    // Create a new page in the context
    const page = await context.newPage();
    await page.goto('https://www.google.com/');

    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});