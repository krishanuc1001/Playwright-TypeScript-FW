const {test, expect, request, Page} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');
const loginPayload = {userEmail: "anshika@gmail.com", userPassword: "Iamking@000"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6581cade9fd99c85e8ee7ff5"}]};
let response;

test.beforeAll("Get token", async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test("Web and API test with Playwright", async ({page}) => {

    await page.addInitScript(value => {
        window.localStorage.setItem("token", value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    const orders = page.locator("//button[@routerlink='/dashboard/myorders']");
    const orderSummaryOrderID = page.locator("//div[@class='col-text -main']");
    const orderTable = page.locator("//tbody");
    const orderRows = page.locator("//tbody//tr");

    await orders.click();
    await orderTable.waitFor();

    for (let i = 0; i < await orderRows.count(); i++) {
        const rowOrderId = await orderRows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await orderRows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await orderSummaryOrderID.textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

    await orders.click();
});
