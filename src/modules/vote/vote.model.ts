import mongoose, { Schema } from "mongoose";
import { TVote } from "./vote.interface";

type VoteDocument = TVote & Document;

const VoteSchema: Schema<VoteDocument> = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  {
    timestamps: true,  // Automatically adds `createdAt` and `updatedAt`
  }
);

// Ensuring that a user can only vote once per post (unique constraint on userId and postId)
VoteSchema.index({ postId: 1, userId: 1 }, { unique: true });

const VoteModel = mongoose.model<VoteDocument>("Vote", VoteSchema);

export default VoteModel;