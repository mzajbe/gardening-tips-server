import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Function to generate unique transaction ID
const generateTranId = () => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomStr = Math.random().toString(36).substring(2, 8); // Random string of alphanumeric characters
  return `tran-${timestamp}-${randomStr}`;
};

export const initialPayment = async (userId: string) => {
  const tran_id = generateTranId();
  const response = await axios.post(process.env.PAYMENT_URL!, {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_Key,
    tran_id: tran_id,
    success_url: `https://gardening-server.vercel.app/api/v1/payment/confirmation/${userId}`,
    fail_url: "https://gardening-server.vercel.app/api/v1/payment/fail",
    cancel_url: "https://gardening-tips-platform-client-nine.vercel.app/",
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
  console.log(response);
  if(response.data.result){
    return response.data.payment_url
  }
  
};
