const { test, expect, request, Page } = require("@playwright/test");
const { APIUtils } = require("./utils/APIUtils.js");
const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};
const orderPayload = {
  orders: [{ country: "India", productOrderedId: "67a8df56c0d3e6622a297ccd" }],
};  
let response;

test.beforeAll("Skip login by fetching token and Create Order", async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload, orderPayload); 
  response = await apiUtils.createOrder(orderPayload);
});

// This test will use the token and orderId from the API response to interact with the web application
// We will verify that the order created via API is visible in the web application
test("Web and API test with Playwright", async ({ page }) => {
  
  // Use addInitScript to set the token in localStorage, this allows to use Javascript method window.localStorage.setItem 
  // This allows the page to access the token as if it was set by the browser
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value); 
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");
  const orders = page.locator("//button[@routerlink='/dashboard/myorders']");
  const orderSummaryOrderID = page.locator("//div[@class='col-text -main']");
  const orderTable = page.locator("//tbody");
  const orderRows = page.locator("//tbody//tr");

  await orders.click();
  await orderTable.waitFor();

  for (let i = 0; i < (await orderRows.count()); i++) {
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
