import catchAsync from "../../utils/catchAsync";
import  sendResponse, { sendResponseLogin } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import config from "../../config";


const signUpUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpUser(req.body);
  // const { refreshToken, accessToken } = result;

  // res.cookie('refreshToken', refreshToken, {
  //   secure: config.NODE_ENV === 'production',
  //   httpOnly: true,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered in successfully!',
    data:result,
    // {
    //   // accessToken,
    //   refreshToken,
    // },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // const { refreshToken, accessToken } = result;

  // res.cookie('refreshToken', refreshToken, {
  //   secure: config.NODE_ENV === 'production',
  //   httpOnly: true,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data:result,
    // {
    //   // accessToken,
    //   refreshToken,
    // },
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