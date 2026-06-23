import httpStatus from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const getAdminOverview = catchAsync(async (_req, res) => {
  const result = await userService.getAdminOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin overview retrieved successfully",
    data: result,
  });
});

const findUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.findUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved succesfully",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const profilePicture = req.file?.path;

  const updatedUser = await userService.updateUserProfile(id, {
    name,
    profilePicture,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

export const UserControllers = {
  getAdminOverview,
  findUserById,
  updateUserProfile,
};
