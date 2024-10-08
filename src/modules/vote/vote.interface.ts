import { Types } from "mongoose";

export type TVote = {
    _id: string;
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    voteType: "upvote" | "downvote";
  };