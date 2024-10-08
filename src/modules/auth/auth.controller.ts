import catchAsync from "../../utils/catchAsync";
import  sendResponse, { sendResponseLogin } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req,res)=>{

    const result = await AuthServices.loginUser(req.body);

    const {refreshToken,accessToken} = result;

    res.cookie('refreshToken',refreshToken,{
        secure:config.NODE_ENV === 'production',
        httpOnly:true,
    })

    sendResponseLogin(res, {
        success: true,
        token:result.accessToken,
        message: 'User is logged in successfully!',
        statusCode:httpStatus.OK,
        data:result.data,
        // accessToken
      });
});

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
    loginUser,
    refreshToken,
}