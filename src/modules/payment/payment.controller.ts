import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { initialPayment } from "./paymynt.utils";
import httpStatus from "http-status-codes";
import { paymentServices } from "./payment.service";

const paymentURL = catchAsync(async (req, res) => {
  const { id: userId } = req.params;
  
  const data = await initialPayment(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment created successfully",
    data: data,
  });
});

const confirmationController = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    await paymentServices.confirmationService(userId);
    res.send(`  
      <!DOCTYPE html>  
      <html lang="en">  
      <head>  
          <meta charset="UTF-8">  
          <meta name="viewport" content="width=device-width, initial-scale=1.0">  
          <title>Payment Success</title>  
          <style>  
              body {  
                  font-family: Arial, sans-serif;  
                  display: flex;  
                  flex-direction: column;  
                  justify-content: center;  
                  align-items: center;  
                  height: 100vh;  
                  margin: 0;  
                  background-color: #f9f9f9;  
              }  
              h1 {  
                  color: #28a745;  
              }  
              .container {  
                  text-align: center;  
                  padding: 20px;  
                  border: 1px solid #ddd;  
                  background-color: #fff;  
                  border-radius: 8px;  
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  
              }  
              .home-button {  
                  margin-top: 20px;  
                  padding: 10px 20px;  
                  background-color: #007bff;  
                  color: #fff;  
                  border: none;  
                  border-radius: 5px;  
                  cursor: pointer;  
                  font-size: 16px;  
              }  
              .home-button:hover {  
                  background-color: #0056b3;  
              }  
          </style>  
      </head>  
      <body>  
          <div class="container">  
              <h1>Payment Successful!</h1>  
              <p>Your payment has been processed successfully. Thank you for your order.</p>  
              <button class="home-button" onclick="window.location.href='https://gardening-tips-platform-client-nine.vercel.app'">Go to Home</button>  
          </div>  
      </body>  
      </html>  
    `);  
  } catch (error) {
    console.error("Payment confirmation failed:", error);
  }

  
};

const paymentFailedController = async (req: Request, res: Response) => {  
  try {  
     
    res.send(`  
      <!DOCTYPE html>  
      <html lang="en">  
      <head>  
          <meta charset="UTF-8">  
          <meta name="viewport" content="width=device-width, initial-scale=1.0">  
          <title>Payment Failed</title>  
          <style>  
              body {  
                  font-family: Arial, sans-serif;  
                  display: flex;  
                  flex-direction: column;  
                  justify-content: center;  
                  align-items: center;  
                  height: 100vh;  
                  margin: 0;  
                  background-color: #f9f9f9;  
              }  
              h1 {  
                  color: #dc3545;  
              }  
              .container {  
                  text-align: center;  
                  padding: 20px;  
                  border: 1px solid #ddd;  
                  background-color: #fff;  
                  border-radius: 8px;  
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  
              }  
              .retry-button {  
                  margin-top: 20px;  
                  padding: 10px 20px;  
                  background-color: #007bff;  
                  color: #fff;  
                  border: none;  
                  border-radius: 5px;  
                  cursor: pointer;  
                  font-size: 16px;  
              }  
              .retry-button:hover {  
                  background-color: #0056b3;  
              }  
          </style>  
      </head>  
      <body>  
          <div class="container">  
              <h1>Payment Failed!</h1>  
              <p>Unfortunately, there was an issue processing your payment. Please try again.</p>  
              <button class="retry-button" onclick="window.location.href='/'">Go to Home</button>  
          </div>  
      </body>  
      </html>  
    `);  
  } catch (error) {  
    console.error("Payment failure handling failed:", error);  
    res.status(500).send("An error occurred while processing your request.");  
  }  
};

export const paymentController = {
  confirmationController,
  paymentURL,
  paymentFailedController
};
