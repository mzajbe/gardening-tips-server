import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { FavouriteService } from "./favourite.service";
import FavouriteModel from "./favourite.model";

const addFavourite = catchAsync(async (req, res) => {
  const { postId, userId } = req.body;

  const result = await FavouriteService.addFavourite(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post favorited successfully",
    data: result,
  });
});

const removeFavourite = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  await FavouriteService.removeFavourite(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Favorite removed successfully",
    data: "",
  });
});

const getFavPost = catchAsync(async (req, res) => {
  // console.log(req.params);

  const postId = req.params.postId;
  console.log(postId);

  const result = await FavouriteService.getFavFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: result,
  });
});

const getFavouriteCount = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const count = await FavouriteService.getFavouriteCount(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Favorite count retrieved successfully",
    data: { count },
  });
});

// const getFavPostOfUser = catchAsync(async (req, res) => {

//   const {userId} = req.params;

//   const result = await FavouriteService.getFavPostOfUserFromDB(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Favorite count retrieved successfully",
//       data: result,
//     });
//   });

const getFavPostOfUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // console.log(userId);

  // Find posts that belong to the user (using 'author' instead of 'user')
  const posts = await FavouriteModel.find({ userId }).populate("postId");

  // Log the posts to see if they are retrieved correctly
  console.log("Posts found:", posts);

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

export const FavouriteController = {
  addFavourite,
  removeFavourite,
  getFavouriteCount,
  getFavPost,
  getFavPostOfUser,
};
