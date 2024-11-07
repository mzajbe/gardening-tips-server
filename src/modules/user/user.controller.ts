import { NextFunction, Request, Response } from "express";
import { userValidationSchema } from "./user.validation";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

// const getAllUsers = catchAsync(async (req, res) => {
//   const result = await userService.getAllUsersFromDB(req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Users are retrieved succesfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

const findUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.findUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const profilePicture = req.file?.path; // Get Cloudinary URL from the uploaded file

  const updatedUser = await userService.updateUserProfile(id, { name, profilePicture });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

// const verifyUser = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   await userService.verifyUserIfEligible(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User verification status updated if eligible",
//     data:"",
//   });
// });


export const UserControllers = {
  // signUp,
  // getAllUsers,
  findUserById,
  updateUserProfile,
  // verifyUser
}