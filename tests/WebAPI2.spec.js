import { test as base, expect } from "@playwright/test";

const URL = "https://rahulshettyacademy.com/client";
const email = "anshika@gmail.com";
const password = "Iamking@000";

let globalContext;

// Create a custom test fixture
const test = base.extend({
  globalContext: async ({ browser }, use) => {
    // Login and save storage state
    const context = await browser.newContext();
    const page = await context.newPage();

    const emailLocator = page.getByPlaceholder("email@example.com");
    const passwordLocator = page.getByPlaceholder("enter your passsword");
    const loginBtn = page.getByRole("button", { name: "Login" });

    await page.goto(URL);
    await emailLocator.fill(email);
    await passwordLocator.fill(password);
    await loginBtn.click();
    await page.waitForLoadState("networkidle");

    await context.storageState({ path: "sessionStorage.json" });
    await context.close();

    // Create a new context with the saved storage state
    const globalContext = await browser.newContext({
      storageState: "sessionStorage.json",
    });
    await use(globalContext);
    await globalContext.close();
  },
});

test("E2E Scenario: Session Storage Demo", async ({ globalContext }) => {
  // Use the globalContext created in the test fixture
  const newPage = await globalContext.newPage();
  await newPage.goto(URL);

  const products = newPage.locator("//div[@class='card-body']");
  const productName = "IPHONE 13 PRO";
  const cartLocator = newPage
    .locator("//li")
    .getByRole("button", { name: "Cart" });
  const productList = newPage.locator("//div//li");
  const productNameLocator = newPage.getByText(productName);
  const countryOptionsDropdown = newPage.locator(
    "//section[contains(@class, 'ta-results')]"
  );
  const selectCountry = newPage.getByPlaceholder("Select Country");

  const orderHistoryPage = newPage.locator(
    "//td[@class='em-spacer-1']//label[@routerlink='/dashboard/myorders']"
  );
  const checkoutBtn = newPage.getByRole("button", { name: "Checkout" });
  const expiryMonth = newPage.locator("(//select[@class='input ddl'])[1]");
  const expiryYear = newPage.locator("(//select[@class='input ddl'])[2]");
  const cvv = newPage.locator(
    "//div[contains(text(), 'CVV Code')]//following-sibling::input"
  );
  const nameOnCard = newPage.locator(
    "//div[contains(text(), 'Name on Card ')]//following-sibling::input"
  );
  const emailLabel = newPage.locator(
    "//div[contains(@class, 'user__name')]//label"
  );
  const placeOrder = newPage.getByText("Place Order ");
  const thankYouText = newPage.getByText("Thankyou for the order.");
  const orderIDLocator = newPage.locator(
    "//td[@class='em-spacer-1']//label[@class='ng-star-inserted']"
  );
  const rows = newPage.locator("//tbody//tr");
  const orderSummaryOrderID = newPage.locator("//div[@class='col-text -main']");

  await products.first().waitFor();
  await newPage.waitForLoadState("networkidle");
  await products
    .filter({ hasText: productName })
    .getByRole("button", { name: "Add To Cart" })
    .click();

  await cartLocator.click();
  await productList.first().waitFor();

  expect(await productNameLocator.isVisible()).toBeTruthy();

  await checkoutBtn.click();

  // Fill the credit card details
  await expiryMonth.selectOption("11");
  await expiryYear.selectOption("27");
  await cvv.fill("123");
  await nameOnCard.fill("Anshika");

  await selectCountry.pressSequentially("ind");
  await newPage.getByRole("button", { name: "India" }).nth(1).click();

  await expect(emailLabel).toHaveText(email);

  await placeOrder.click();

  await expect(thankYouText).toBeVisible();

  const orderID = await orderIDLocator.textContent();
  console.log(orderID);

  await orderHistoryPage.click();
  await newPage.locator("//tbody").waitFor();

  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = rows.nth(i).locator("//th").textContent();
    if (orderID.includes(await rowOrderId)) {
      console.log("Order ID found in the order history");
      await rows.nth(i).locator("//button[@class='btn btn-primary']").click();
      break;
    }
  }

  expect(
    orderID.includes((await orderSummaryOrderID.textContent()).trim())
  ).toBeTruthy();

  await newPage.close();
});

test("E2E Scenario: Print product name", async ({ globalContext }) => {
  // Use the globalContext created in the test fixture
  const newPage = await globalContext.newPage();
  await newPage.goto(URL);

  const products = newPage.locator("//div[@class='card-body']");
  const productNames = newPage.locator("//div[@class='card-body']//b");

  await products.first().waitFor();
  await newPage.waitForLoadState("networkidle");

  console.log(" ******************** Product Names ********************");
  // Write a for each loop to print each product name using the locator productNames
  const count = await productNames.count();
  for (let i = 0; i < count; i++) {
    const name = await productNames.nth(i).textContent();
    console.log(name);
    console.log("--------------------------------------------------");
  }

  expect(count).toBeGreaterThan(0);
  await newPage.close();
});

test.afterAll(async () => {
  if (globalContext) {
    await globalContext.close();
  }
});
