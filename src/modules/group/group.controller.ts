import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { GroupService } from './group.service';

const createGroup = catchAsync(async (req, res) => {
  const result = await GroupService.createGroup(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Group created successfully',
    data: result,
  });
});

const getAllGroups = catchAsync(async (req, res) => {
  const result = await GroupService.getAllGroups();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Groups retrieved successfully',
    data: result,
  });
});

const getGroupById = catchAsync(async (req, res) => {
  const result = await GroupService.getGroupById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const joinGroup = catchAsync(async (req, res) => {
  const result = await GroupService.joinGroup(req.params.id, req.body.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Joined group successfully',
    data: result,
  });
});

const leaveGroup = catchAsync(async (req, res) => {
  const result = await GroupService.leaveGroup(req.params.id, req.body.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Left group successfully',
    data: result,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const result = await GroupService.deleteGroup(req.params.id, req.body.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group deleted successfully',
    data: result,
  });
});

export const GroupControllers = {
  createGroup,
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  deleteGroup,
};
