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

test("Learn exclusive Playwright Locators", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const URL = 'https://rahulshettyacademy.com/angularpractice/';

    await page.goto(URL);

    // For Check box, Radio buttons, Dropdowns with labels
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Male");

    // When there ia placeholder attribute for a web element
    await page.getByPlaceholder("Password").fill("abc123");

    // When there is a button with text, use getByRole
    await page.getByRole("button", {name: "Submit"}).click();

    // When there is an element with text, use getByText
    console.log(await page.getByText("Success! The Form has been submitted successfully!.").isVisible());

    await page.getByRole("link", {name: "Shop"}).click();

    await page.locator("//app-card").filter({hasText: 'Nokia Edge'})
        .getByRole("button", {name: "Add"})
        .click();

});

test("Handle Calendar Validations ", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const URL = "https://rahulshettyacademy.com/seleniumPractise";
    const date = "10";
    const month = "1";
    const year = "2027";
    const expectedList = [month, date, year];
    const topDeals = page.locator("//a[contains(text(), 'Top Deals')]");

    await page.goto(URL);

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        topDeals.click()
    ]);

    expect(await newPage.locator("//div[@class='date-field-container']").isVisible()).toBeTruthy();

    // Open Calendar
    await newPage.locator("//button[@class='react-date-picker__calendar-button react-date-picker__button']").click();

    // Click on navigation label twice to go to Year selection
    await newPage.locator("//button[@class='react-calendar__navigation__label']").click()
    await newPage.locator("//button[@class='react-calendar__navigation__label']").click()

    // Select Year
    await newPage.getByRole('button', {name: year}).click();

    // Select Month
    await newPage.locator("//button[contains(@class, 'react-calendar__year-view__months__month')]").nth(Number(month) - 1).click();

    // Select Day
    await newPage.locator("//abbr[text()='" + date + "']").click();

    // Assertion
    const inputs = await newPage.locator("//div[@class='react-date-picker__inputGroup']//input");

    for (let i = 0; i < inputs.length; i++) {
        const value = inputs[i].getAttribute('value');
        expect(value).toEqual(expectedList[i]);
    }

});

test("Handle Hidden elements", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("//input[@id='displayed-text']")).toBeVisible();

    await page.locator("//input[@id='hide-textbox']").click();
    await expect(page.locator("//input[@id='displayed-text']")).toBeHidden();

    await page.locator("//input[@id='show-textbox']").click();
    await expect(page.locator("//input[@id='displayed-text']")).toBeVisible();

});

test("Handle Pop-up Javascript dialog box", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.locator("//input[@id='confirmbtn']").click();
    page.on('dialog', dialog => dialog.accept());

});

test("Hover and select value", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.locator("//button[@id='mousehover']").hover();

});

test("Handle iframes", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await page.waitForLoadState('domcontentloaded');
    const framePage = page.frameLocator("//iframe[@id='courses-iframe']");

    // When there are multiple elements some of which are hidden, using :visible will click on the visible element
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
    console.log(await framePage.locator("//*[@class='text']//h2//span").textContent());

});