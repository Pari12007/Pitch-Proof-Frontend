import api from "./api";

    export const createCheckoutSssion = () => {
        return api.post("/billing/create-checkout-session");
    };