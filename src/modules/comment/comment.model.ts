import mongoose, { Schema } from "mongoose";
import { TComment } from "./comment.interface";

type CommentDocument = TComment & Document;

const CommentSchema: Schema<CommentDocument> = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

const CommentModel = mongoose.model<CommentDocument>("Comment", CommentSchema);

export default CommentModel;