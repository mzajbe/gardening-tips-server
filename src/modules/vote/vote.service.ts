import { TVote } from "./vote.interface";
import VoteModel from "./vote.model";


/**
 * Upvote or downvote a post
 * If the user has already voted on this post, update the vote type.
 * If not, create a new vote entry.
 */
const castVote = async (postId: string, userId: string, voteType: "upvote" | "downvote"): Promise<TVote | null> => {
  // Check if the user has already voted on this post
  const existingVote = await VoteModel.findOne({ postId, userId });

  if (existingVote) {
    // If the vote type is the same, do nothing
    if (existingVote.voteType === voteType) {
      return existingVote;
    }
    // Update the existing vote if the type has changed
    existingVote.voteType = voteType;
    await existingVote.save();
    return existingVote;
  }

  // If no existing vote, create a new vote
  const newVote = await VoteModel.create({ postId, userId, voteType });
  return newVote;
};

/**
 * Get the total upvotes and downvotes for a specific post
 */
const getVotesCount = async (postId: string) => {
  const upvoteCount = await VoteModel.countDocuments({ postId, voteType: "upvote" });
  const downvoteCount = await VoteModel.countDocuments({ postId, voteType: "downvote" });

  return { upvoteCount, downvoteCount };
};

export const VoteService = {
  castVote,
  getVotesCount,
};
