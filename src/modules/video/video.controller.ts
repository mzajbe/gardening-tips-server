import httpStatus from "http-status-codes";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VideoService } from "./video.service";

const createVideo = catchAsync(async (req, res) => {
  const userId = (req.user as any)?._id;
  const result = await VideoService.createVideoIntoDB(req.body, String(userId));

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Video uploaded successfully",
    data: result,
  });
});

const getAllVideos = catchAsync(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const category =
    typeof req.query.category === "string" ? req.query.category : undefined;

  const result = await VideoService.getAllVideosFromDB({
    page,
    limit,
    search,
    category,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Videos retrieved successfully",
    data: result,
  });
});

const getVideoById = catchAsync(async (req, res) => {
  const result = await VideoService.getVideoByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video retrieved successfully",
    data: result,
  });
});

const getRelatedVideos = catchAsync(async (req, res) => {
  const result = await VideoService.getRelatedVideosFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Related videos retrieved successfully",
    data: result,
  });
});

const incrementVideoViewCount = catchAsync(async (req, res) => {
  const result = await VideoService.incrementVideoViewCountInDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video view count updated",
    data: result,
  });
});

const updateVideo = catchAsync(async (req, res) => {
  const result = await VideoService.updateVideoInDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video updated successfully",
    data: result,
  });
});

const deleteVideo = catchAsync(async (req, res) => {
  await VideoService.deleteVideoFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video deleted successfully",
    data: null,
  });
});

export const VideoController = {
  createVideo,
  getAllVideos,
  getVideoById,
  getRelatedVideos,
  incrementVideoViewCount,
  updateVideo,
  deleteVideo,
};
