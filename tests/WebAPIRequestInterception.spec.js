import { test, expect, request } from "@playwright/test";
import { APIUtils } from "./utils/APIUtils.js";
const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};
const orderPayload = {
  orders: [{ country: "India", productOrderedId: "67a8df56c0d3e6622a297ccd" }],
};
let response;
const fakePayloadWithNoOrders = { data: [], message: "No Orders" };

test.beforeAll("Skip login by fetching token and Create Order", async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload, orderPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("Request interception with Playwright", async ({ page }) => {
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

  // Intercept the API request to get orders for the customer.
  // This will replace the URL with a specific order ID to ensure we get the correct order details
  // This is useful for testing how the web application handles a scenario when a different order ID is requested
  // and only the correct order is displayed in the UI, request interception should give us unauthorized error.
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer?id=*",
    route.continue({
      url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer?id=685515c60e7068d398205a16",
    })
  );

  for (let i = 0; i < (await orderRows.count()); i++) {
    const rowOrderId = await orderRows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await orderRows.nth(i).locator("button").first().click();
      break;
    }
  }

  await page.pause(); // Pause to inspect the page manually if needed

  // const orderIdDetails = await orderSummaryOrderID.textContent();
  // expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
