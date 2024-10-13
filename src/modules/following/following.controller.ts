import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { FollowerService } from "./following.service";
import AppError from "../../error/AppError";
import httpStatus from 'http-status-codes';
import Follower from "./following.model";
// Follow a user
export const followUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { followerId, followingId } = req.body;

  const result = await FollowerService.followUser(followerId, followingId);

  if (!result) {
    return next(new AppError(httpStatus.BAD_REQUEST, "Unable to follow user"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

// Unfollow a user
export const unfollowUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { followerId, followingId } = req.body;

  const result = await FollowerService.unfollowUser(followerId, followingId);

  if (!result) {
    return next(new AppError(httpStatus.BAD_REQUEST, "Unable to unfollow user"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "User unfollowed successfully",
    data: result,
  });
});

// Get followers for a user
export const getFollowers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const followers = await FollowerService.getFollowers(userId);

  if (!followers) {
    return next(new AppError(httpStatus.NOT_FOUND, "No followers found"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: followers,
  });
});

// Get following for a user
export const getFollowing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const following = await FollowerService.getFollowing(userId);

  if (!following) {
    return next(new AppError(httpStatus.NOT_FOUND, "No following users found"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: following,
  });
});

// Controller for checking follow status
export const checkFollowStatus = catchAsync(async (req, res, next) => {
    const { followerId, followingId } = req.params;
    
    try {
      const isFollowing = await Follower.exists({ follower: followerId, following: followingId });
      res.status(200).json({ isFollowing: !!isFollowing });
    } catch (error) {
      next(error);
    }
  });
