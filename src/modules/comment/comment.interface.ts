
import { Types } from "mongoose";

export type TComment = {
    _id: string;
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};