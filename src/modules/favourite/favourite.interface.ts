import { Types } from "mongoose";

export type TFavourite = {
  _id: string;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
};
