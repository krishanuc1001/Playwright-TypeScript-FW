import { expect } from "@playwright/test";

class APIUtils {
  /**
   * Constructor for APIUtils class.
   * @param {APIRequestContext} apiContext - The API request context to be used for making requests.
   * @param {Object} loginPayload - The payload containing user credentials for login.
   * @param {Object} orderPayload - The payload containing order details.
   */
  constructor(apiContext, loginPayload, orderPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
    this.orderPayload = orderPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayload,
      }
    );

    // Check if the response status is 200 or ok
    expect(loginResponse.ok()).toBeTruthy(); // Ensure the response is successful

    // if (loginResponse.statusText !== 200) {
    //   throw new Error("Failed to log in: " + loginResponse.statusText());
    // }
    const loginResponseJSON = await loginResponse.json();
    const loginToken = loginResponseJSON.token;
    console.log(loginToken);
    return loginToken;
  }

  async createOrder(orderPayload) {
    let response = {};
    response.token = await this.getToken(); // Storing token to the response object for later use in the test script
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          Authorization: response.token,
          "Content-Type": "application/json",
        },
      }
    );

    const orderResponseJSON = await orderResponse.json();
    console.log(orderResponseJSON);

    const orderId = orderResponseJSON.orders[0];
    response.orderId = orderId; // Storing order ID to the response object for later use in the test script
    console.log("Order ID: " + orderId);
    return response;
  }
}

export { APIUtils };