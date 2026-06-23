import httpStatus from "http-status-codes";
import { FilterQuery, Types } from "mongoose";

import AppError from "../../error/AppError";
import Video from "./video.model";
import { TVideo, TVideoPayload, TVideoQuery, TVideoUpdatePayload } from "./video.interface";

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const extractYouTubeVideoId = (youtubeUrl: string) => {
  try {
    const parsedUrl = new URL(youtubeUrl);
    const hostname = parsedUrl.hostname.replace("www.", "").toLowerCase();

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/")[1] || "";
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1] || "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1] || "";
      }
    }

    if (!YOUTUBE_ID_REGEX.test(videoId)) {
      return null;
    }

    return videoId;
  } catch {
    return null;
  }
};

const toThumbnailUrl = (youtubeVideoId: string) =>
  `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

const createVideoIntoDB = async (payload: TVideoPayload, userId: string) => {
  const youtubeVideoId = extractYouTubeVideoId(payload.youtubeUrl);

  if (!youtubeVideoId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only valid YouTube URLs are allowed"
    );
  }

  const isDuplicate = await Video.findOne({ youtubeVideoId });

  if (isDuplicate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This YouTube video is already in the learning center"
    );
  }

  return Video.create({
    ...payload,
    youtubeVideoId,
    thumbnailUrl: toThumbnailUrl(youtubeVideoId),
    uploadedBy: new Types.ObjectId(userId),
  });
};

const getAllVideosFromDB = async (query: TVideoQuery = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const skip = (page - 1) * limit;

  const filters: FilterQuery<TVideo> = {};

  if (query.category && query.category !== "All") {
    filters.category = query.category;
  }

  const searchTerm = query.search?.trim();

  if (searchTerm) {
    const pattern = { $regex: searchTerm, $options: "i" };
    filters.$or = [
      { title: pattern },
      { description: pattern },
      { category: pattern },
    ];
  }

  const [videos, total] = await Promise.all([
    Video.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Video.countDocuments(filters),
  ]);

  return {
    videos,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

const getVideoByIdFromDB = async (videoId: string) => {
  const video = await Video.findById(videoId);

  if (!video) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found");
  }

  return video;
};

const getRelatedVideosFromDB = async (videoId: string) => {
  const currentVideo = await Video.findById(videoId);

  if (!currentVideo) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found");
  }

  return Video.find({
    _id: { $ne: currentVideo._id },
    category: currentVideo.category,
  })
    .sort({ createdAt: -1 })
    .limit(4);
};

const incrementVideoViewCountInDB = async (videoId: string) => {
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!updatedVideo) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found");
  }

  return updatedVideo;
};

const updateVideoInDB = async (
  videoId: string,
  payload: TVideoUpdatePayload
) => {
  const existingVideo = await Video.findById(videoId);

  if (!existingVideo) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found");
  }

  const updateData: TVideoUpdatePayload & {
    youtubeVideoId?: string;
    thumbnailUrl?: string;
  } = { ...payload };

  if (payload.youtubeUrl) {
    const youtubeVideoId = extractYouTubeVideoId(payload.youtubeUrl);

    if (!youtubeVideoId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only valid YouTube URLs are allowed"
      );
    }

    const duplicateVideo = await Video.findOne({
      youtubeVideoId,
      _id: { $ne: videoId },
    });

    if (duplicateVideo) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This YouTube video is already in the learning center"
      );
    }

    updateData.youtubeVideoId = youtubeVideoId;
    updateData.thumbnailUrl = toThumbnailUrl(youtubeVideoId);
  }

  return Video.findByIdAndUpdate(videoId, updateData, { new: true });
};

const deleteVideoFromDB = async (videoId: string) => {
  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found");
  }

  return deletedVideo;
};

export const VideoService = {
  createVideoIntoDB,
  getAllVideosFromDB,
  getVideoByIdFromDB,
  getRelatedVideosFromDB,
  incrementVideoViewCountInDB,
  updateVideoInDB,
  deleteVideoFromDB,
};
