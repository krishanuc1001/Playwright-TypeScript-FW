const {test, expect} = require("@playwright/test");

test("E2E Scenario: Add to Cart", async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const URL = "https://rahulshettyacademy.com/client";
    const email = "anshika@gmail.com";
    const password = "Iamking@000";
    const emailLocator = page.locator("//input[@id='userEmail']");
    const passwordLocator = page.locator("//input[@id='userPassword']");
    const loginBtn = page.locator("//input[@id='login']");
    const products = page.locator("//div[@class='card-body']");
    const productsCount = await products.count();
    const productName = "IPHONE 13 PRO";
    const cartLocator = page.locator("//button[@routerlink='/dashboard/cart']");
    const productList = page.locator("//div//li");
    const productNameLocator = page.locator("//h3[contains(text(),productName)]");
    const countryOptionsDropdown = page.locator("//section[contains(@class, 'ta-results')]");
    const numOfCountries = await countryOptionsDropdown.locator("//button//i").count();
    const selectCountry = page.locator("//input[@placeholder='Select Country']");
    const orderHistoryPage = page.locator("//td[@class='em-spacer-1']//label[@routerlink='/dashboard/myorders']");
    const checkoutBtn = page.locator("//button[text()='Checkout']");
    const expiryMonth = page.locator("(//select[@class='input ddl'])[1]");
    const expiryYear = page.locator("(//select[@class='input ddl'])[2]");
    const cvv = page.locator("//div[contains(text(), 'CVV Code')]//following-sibling::input");
    const nameOnCard = page.locator("//div[contains(text(), 'Name on Card ')]//following-sibling::input");
    const emailLabel = page.locator("//div[contains(@class, 'user__name')]//label");
    const placeOrder = page.locator("//*[contains(@class, 'action__submit')]");
    const thankYouText = page.locator("//*[@class='hero-primary']");
    const orderIDLocator = page.locator("//td[@class='em-spacer-1']//label[@class='ng-star-inserted']");
    const rows = page.locator("//tbody//tr");
    const orderSummaryOrderID = page.locator("//div[@class='col-text -main']");

    await page.goto(URL);
    await emailLocator.fill(email);
    await passwordLocator.fill(password);
    await loginBtn.click();

    await products.first().waitFor();
    console.log(await products.allTextContents());

    for (let i = 0; i < productsCount; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            await products.nth(i).locator("text = Add To Cart").click();
            break;
        }
    }

    // await page.pause();
    await cartLocator.click();
    await productList.first().waitFor();

    expect(await productNameLocator.isVisible()).toBeTruthy();

    await checkoutBtn.click();

    // Fill the credit card details
    await expiryMonth.selectOption("11");
    await expiryYear.selectOption("27");
    await cvv.fill('123');
    await nameOnCard.fill('Anshika');

    await selectCountry.pressSequentially("ind");
    await countryOptionsDropdown.waitFor();

    for (let i = 0; i < numOfCountries; ++i) {
        if (((await countryOptionsDropdown.locator("//button//i").nth(i).textContent()).trim()) === "India") {
            await countryOptionsDropdown.locator("//button//i").nth(i).click();
            break;
        }
    }

    await expect(emailLabel).toHaveText(email);

    await placeOrder.click();

    await expect(thankYouText).toHaveText(" Thankyou for the order. ");

    const orderID = await orderIDLocator.textContent();
    console.log(orderID);

    await orderHistoryPage.click();
    await page.locator("//tbody").waitFor();

    for (let i = 0; i < (await rows.count()); i++) {
        const rowOrderId = rows.nth(i).locator("//th").textContent();
        if (orderID.includes(await rowOrderId)) {
            console.log("Order ID found in the order history");
            await rows.nth(i).locator("//button[@class='btn btn-primary']").click();
            break;
        }
    }

    expect(orderID.includes((await orderSummaryOrderID.textContent()).trim())).toBeTruthy();

});