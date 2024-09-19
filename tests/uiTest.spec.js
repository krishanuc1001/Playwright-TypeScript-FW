const {test, expect} = require('@playwright/test');

test('Test 1: Handle list of elements | Static Select Drop-down | Radio Button | Check box', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    const username = 'rahulshettyacademy';
    const password = 'learning';
    const usernameLocator = page.locator("//input[@id='username']");
    const passwordLocator = page.locator("//input[@id='password']");
    const termsLocator = page.locator("//input[@id='terms'][@name='terms']");
    const signInLocator = page.locator("//input[@id='signInBtn']");
    const deviceCardLocators = page.locator("//app-card//h4//a");
    const expectedPageTitle = 'LoginPage Practise | Rahul Shetty Academy';
    const dropDownLocator = page.locator("//select[@class='form-control']");
    const userRadioBtn = page.locator("//input[@value='user']//following-sibling::span");
    const adminRadioBtn = page.locator("//input[@value='admin']//following-sibling::span");
    const acceptRadioBtn = page.locator("//button[@id='okayBtn']");
    const documentLink = page.locator("//a[contains(@href, 'documents-request')]");

    await page.goto(URL);
    await usernameLocator.fill(username);
    await passwordLocator.fill(password);

    // Handle Dropdown
    await dropDownLocator.selectOption("consult");

    // Handle Radio button
    await userRadioBtn.click();
    await acceptRadioBtn.click();
    // Approach 1: Assert whether radio button is checked
    await expect(userRadioBtn).toBeChecked();
    // Approach 2: Assert by returning boolean whether radio button is checked
    console.log(await userRadioBtn.isChecked());

    // Handling check-box
    await termsLocator.click();
    // Assert whether check-box is checked
    await expect(termsLocator).toBeChecked();

    await termsLocator.uncheck();
    // Assert whether check-box is un-checked
    expect(await termsLocator.isChecked()).toBeFalsy();

    await expect(documentLink).toHaveAttribute('class', 'blinkingText');

    await signInLocator.click();

    const actualPageTitle = await page.title();
    console.log(actualPageTitle);
    await expect(page).toHaveTitle(expectedPageTitle);

    // Approach 1: Wait using waitForLoadState method with networkidle
    // await page.waitForLoadState('networkidle');
    // Approach 2: Wait using waitFor method
    await deviceCardLocators.first().waitFor();
    const deviceTitles = await deviceCardLocators.allTextContents();
    console.log(deviceTitles);

});

test('Test 2: Window Handling', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const usernameLocator = page.locator("//input[@id='username']");

    const URL = 'https://rahulshettyacademy.com/loginpagePractise/';
    const documentLink = page.locator("//a[contains(@href, 'documents-request')]");

    await page.goto(URL);

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ]);

    const newPageText = await newPage.locator("//p[@class='im-para red']").textContent();

    const textArray = newPageText.split("@");
    const domain = textArray[1].split(" ")[0];

    await usernameLocator.fill(domain);
    console.log(await usernameLocator.inputValue());
});

test('Wait for list of items example 2', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("//input[@id='userEmail']").fill("anshika@gmail.com");
    await page.locator("//input[@id='userPassword']").fill("Iamking@000");
    await page.locator("//input[@id='login']").click();

    await page.locator("//div[@class='card-body']//b").first().waitFor();
    console.log(await page.locator("//div[@class='card-body']//b").allTextContents());
});

test('Saucedemo Test with context', async ({browser}) => {

    // This opens a new browser context with plugins/ cookies/ proxies
    const context = await browser.newContext();

    // Create a new page in the context
    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com/');

    console.log(await page.title());
    await expect(page).toHaveTitle('Swag Labs');

    await page.locator("//input[@id='user-name']").fill('standard_user');
    await page.locator("//input[@id='password']").fill('secret_sauce');
    await page.locator("//input[@id='login-button']").click();

    console.log(await page.locator("//div[@data-test='inventory-item-name']").allTextContents());
});