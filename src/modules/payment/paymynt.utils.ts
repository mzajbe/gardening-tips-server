import axios from "axios";
import config from "../../config";

// Function to generate unique transaction ID
const generateTranId = () => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomStr = Math.random().toString(36).substring(2, 8); // Random string of alphanumeric characters
  return `tran-${timestamp}-${randomStr}`;
};

export const initialPayment = async (userId: string) => {
  if (!config.payment_url || !config.store_id || !config.payment_signature_key) {
    throw new Error("Payment environment variables are not configured correctly");
  }

  if (!config.backend_base_url || !config.frontend_base_url) {
    throw new Error("BACKEND_BASE_URL and FRONTEND_BASE_URL must be configured");
  }

  const tran_id = generateTranId();
  const response = await axios.post(config.payment_url, {
    store_id: config.store_id,
    signature_key: config.payment_signature_key,
    tran_id: tran_id,
    success_url: `${config.backend_base_url}/api/v1/payment/confirmation/${userId}`,
    fail_url: `${config.backend_base_url}/api/v1/payment/fail`,
    cancel_url: config.frontend_base_url,
    amount: "1.0",
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: "Name",
    cus_email: "payer@merchantcusomter.com",
    cus_add1: "House B-158 Road 22",
    cus_add2: "Mohakhali DOHS",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: "+8801704",
    type: "json",
  });
  console.log(response.data);
  if (response.data.result) {
    return response.data.payment_url;
  }
};
