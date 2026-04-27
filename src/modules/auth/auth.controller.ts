import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import config from "../../config";
import { CookieOptions } from "express";

const refreshCookieOptions: CookieOptions = {
  secure: config.NODE_ENV === "production",
  httpOnly: true,
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 24 * 60 * 60 * 1000,
};


const signUpUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// const signUpUser = catchAsync(async (req, res)=>{
//   const result = await AuthServices.signUpUser(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User registered successfully',
//     data: result,
//   });
// });

// const loginUser = catchAsync(async (req,res)=>{

//     const result = await AuthServices.loginUser(req.body);

//     const {refreshToken,accessToken} = result;

//     // res.cookie('refreshToken',refreshToken,{
//     //     secure:config.NODE_ENV === 'production',
//     //     httpOnly:true,
//     // })

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User is logged in successfully!',
//       data: {
//         accessToken,
//         refreshToken,
//       },
//     });
// });



const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    });
  });

export const AuthControllers = {
  signUpUser,
    loginUser,
    refreshToken,
}
