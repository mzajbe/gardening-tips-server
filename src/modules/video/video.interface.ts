import { Types } from "mongoose";

export type TVideo = {
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  viewCount: number;
  uploadedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TVideoPayload = {
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
};

export type TVideoUpdatePayload = Partial<TVideoPayload>;

export type TVideoQuery = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};
