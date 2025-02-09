const {expect} = require("@playwright/test");

class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayload
        });

        const loginResponseJSON = await loginResponse.json();
        const loginToken = loginResponseJSON.token;
        console.log(loginToken);
        return loginToken;
    }

    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken(); // Storing token to the response object for later use in the test script
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                "Authorization": response.token,
                "Content-Type": "application/json"
            }
        });

        const orderResponseJSON = await orderResponse.json();
        console.log("Order Response: " + orderResponseJSON);
        const orderId = orderResponseJSON.orders[0];
        response.orderId = orderId; // Storing order ID to the response object for later use in the test  script
        console.log("Order ID: " + orderId);
        return response;
    }

}

module.exports = {APIUtils};