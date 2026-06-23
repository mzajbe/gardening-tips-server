import httpStatus from 'http-status-codes';

import AppError from '../../error/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GroupPostService } from './groupPost.service';

const MAX_GROUP_POST_IMAGE_SIZE = 5 * 1024 * 1024;

const createGroupPost = catchAsync(async (req, res) => {
  const userId = (req.user as any)?._id?.toString();

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  if (req.file?.size && req.file.size > MAX_GROUP_POST_IMAGE_SIZE) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image must be 5MB or smaller');
  }

  const result = await GroupPostService.createGroupPost(
    req.params.id,
    userId,
    { content: req.body.content },
    req.file?.path
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Group post created successfully',
    data: result,
  });
});

const getGroupPosts = catchAsync(async (req, res) => {
  const userId = (req.user as any)?._id?.toString();
  const result = await GroupPostService.getGroupPosts(req.params.id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group posts retrieved successfully',
    data: result,
  });
});

const setGroupPostDisabled = catchAsync(async (req, res) => {
  const userId = (req.user as any)?._id?.toString();

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await GroupPostService.setGroupPostDisabled(
    req.params.id,
    req.params.postId,
    userId,
    Boolean(req.body?.isDisabled)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.isDisabled ? 'Post disabled successfully' : 'Post enabled successfully',
    data: result,
  });
});

const deleteGroupPost = catchAsync(async (req, res) => {
  const userId = (req.user as any)?._id?.toString();

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  await GroupPostService.deleteGroupPost(req.params.id, req.params.postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: null,
  });
});

const getGroupPostsByUser = catchAsync(async (req, res) => {
  const result = await GroupPostService.getGroupPostsByUser(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User group posts retrieved successfully',
    data: result,
  });
});

export const GroupPostControllers = {
  createGroupPost,
  getGroupPosts,
  setGroupPostDisabled,
  deleteGroupPost,
  getGroupPostsByUser,
};
