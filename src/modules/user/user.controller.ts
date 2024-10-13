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


export const UserControllers = {
  // signUp,
  // getAllUsers,
  findUserById
}