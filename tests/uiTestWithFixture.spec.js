const { test, expect } = require('@playwright/test');

// Define a fixture
test.beforeEach(async ({ page }) => {
    // This code runs before each test
    await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
    // This code runs after each test
    await page.close();
});

test('example test', async ({ page }) => {
    // The page is already navigated to 'https://example.com' due to the beforeEach fixture
    const title = await page.title();
    expect(title).toBe('Example Domain');
});
