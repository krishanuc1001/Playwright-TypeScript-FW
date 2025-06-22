import { test, expect } from "@playwright/test";

test("Request interception with Playwright", async ({ page }) => {
  const URL = "https://rahulshettyacademy.com/client";
  const email = "anshika@gmail.com";
  const password = "Iamking@000";
  const emailLocator = page.getByPlaceholder("email@example.com");
  const passwordLocator = page.getByPlaceholder("enter your passsword");
  const loginBtn = page.getByRole("button", { name: "Login" });
  const products = page.locator("//div[@class='card-body']");
  const orders = page.locator("//button[@routerlink='/dashboard/myorders']");
  const orderViewBtn = page.getByRole("button", { name: "View" });
  const notAuthorizedText = page.locator("p").last();

  await page.goto(URL);
  await emailLocator.fill(email);
  await passwordLocator.fill(password);
  await loginBtn.click();
  await products.first().waitFor();

  await orders.click();

  // Intercept the API request to get orders for the customer.
  // This will replace the URL with a specific order ID to ensure we get the correct order details
  // This is useful for testing how the web application handles a scenario when a different order ID is requested
  // and only the correct order is displayed in the UI, request interception should give us unauthorized error.
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=685863760e7068d39825db6a",
      })
  );

  await orderViewBtn.first().click();

  await expect(notAuthorizedText).toHaveText(
    "You are not authorize to view this order"
  );
});
