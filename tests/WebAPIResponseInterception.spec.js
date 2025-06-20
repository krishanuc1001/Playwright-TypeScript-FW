import { test, expect, request, Page } from "@playwright/test";
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

// This test will use the token and orderId from the API response to interact with the web application
// We will verify that the order created via API is visible in the web application
// The test uses `addInitScript` to set the token in localStorage, allowing the web application to access it as if it was set by the browser.

// Important Note: This test intercepts the API response to simulate a scenario where no orders are returned
// This is useful for testing how the web application handles such cases.
// The test uses Playwright's `route` method to intercept the API call and return a custom response.
// The `fakePayloadWithNoOrders` object is used to simulate the API response when there are no orders.

test("Web and API test with Playwright intercepting API response", async ({
  page,
}) => {
  const orders = page.locator("//button[@routerlink='/dashboard/myorders']");
  const noOrders = page.locator("//div[@class = 'mt-4 ng-star-inserted']");
  // Use addInitScript to set the token in localStorage, this allows to use Javascript method window.localStorage.setItem
  // This allows the page to access the token as if it was set by the browser
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayloadWithNoOrders); // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
      route.fulfill({
        response,
        body,
      });
    }
  );

  await orders.click();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
  );
  console.log(await noOrders.textContent());

  // Verify that the text content of the noOrders element matches the expected message
  expect(await noOrders.textContent()).toContain(
    fakePayloadWithNoOrders.message
  );
});
