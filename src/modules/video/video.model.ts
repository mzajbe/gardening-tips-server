import { Schema, model } from "mongoose";

import { TVideo } from "./video.interface";

const videoSchema = new Schema<TVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = model<TVideo>("Video", videoSchema);

export default Video;
