import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import httpStatus from 'http-status-codes';
import { VoteService } from "./vote.service";

// Cast a vote (upvote/downvote) for a post
const castVote = catchAsync(async (req, res) => {
  const { postId, voteType } = req.body;
  
  const userId = req.user._id;  // Assuming req.user contains the authenticated user's info

  const result = await VoteService.castVote(postId, userId, voteType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Vote ${voteType === "upvote" ? "added" : "updated"} successfully`,
    data: result,
  });
});

// Get vote count for a post
const getVotesCount = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const result = await VoteService.getVotesCount(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote count retrieved successfully",
    data: result,
  });
});

export const VoteController = {
  castVote,
  getVotesCount,
};
