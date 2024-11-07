import { ObjectId } from "mongoose";
import Post from "../posts/posts.model";
import User from "../user/user.model";
import { userService } from "../user/user.service";
import { TVote } from "./vote.interface";
import VoteModel from "./vote.model";


/**
 * Upvote or downvote a post
 * If the user has already voted on this post, update the vote type.
 * If not, create a new vote entry.
 */
// const castVote = async (postId: string, userId: string, voteType: "upvote" | "downvote"): Promise<TVote | null> => {
//   // Check if the user has already voted on this post
//   const existingVote = await VoteModel.findOne({ postId, userId });

//   if (existingVote) {
//     // If the vote type is the same, do nothing
//     if (existingVote.voteType === voteType) {
//       return existingVote;
//     }
//     // Update the existing vote if the type has changed
//     existingVote.voteType = voteType;
//     await existingVote.save();
//     return existingVote;
//   }

//   // If no existing vote, create a new vote
//   const newVote = await VoteModel.create({ postId, userId, voteType });
//   return newVote;
// };


// const verifyUserIfEligible = async (userId: string) => {
//   const hasUpvotedPost = await VoteModel.exists({ userId, voteType: "upvote" });

//   if (hasUpvotedPost) {
//     // Set isVerified to true if an upvote exists
//     await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
//   }
// };

const verifyUserIfEligible = async (userId: string | ObjectId) => {
  const hasUpvotedPost = await VoteModel.exists({ userId, voteType: "upvote" });

  if (hasUpvotedPost) {
    await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
  }
};


// const castVote = async (postId: string, userId: string, voteType: "upvote" | "downvote"): Promise<TVote | null> => {
//   // Check if the user has already voted on this post
//   const existingVote = await VoteModel.findOne({ postId, userId });

//   if (existingVote) {
//     // If the vote type is the same, do nothing
//     if (existingVote.voteType === voteType) {
//       return existingVote;
//     }
//     // Update the existing vote if the type has changed
//     existingVote.voteType = voteType;
//     await existingVote.save();
//   } else {
//     // If no existing vote, create a new vote
//     const newVote = await VoteModel.create({ postId, userId, voteType });
    
//     // Check if the user is eligible for verification after an upvote
//     if (voteType === "upvote") {
//       await verifyUserIfEligible(userId);
//     }
    
//     return newVote;
//   }

//   // Check if the user is eligible for verification after updating to an upvote
//   // if (voteType === "upvote") {
//   //   await verifyUserIfEligible(userId);
//   // }

//   return existingVote;
// };


const castVote = async (postId: string, userId: string, voteType: "upvote" | "downvote"): Promise<TVote | null> => {
  const existingVote = await VoteModel.findOne({ postId, userId });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      return existingVote; // Exit early if the vote type is the same
    }

    // Update the existing vote type
    existingVote.voteType = voteType;
    await existingVote.save();
  } else {
    // Create a new vote
    const newVote = await VoteModel.create({ postId, userId, voteType });
    
    // if (voteType === "upvote") {
    //   const post = await Post.findById(postId);
    //   if (post) {
    //     await verifyUserIfEligible(post.author.toString()); // Verify the post author after upvote
    //   }
    // }

    if (voteType === "upvote") {
      const post = await Post.findById(postId);
      if (post && post.author.toString() !== userId) {  // Check if the user is not the author
        await verifyUserIfEligible(post.author.toString()); // Verify the post author after an upvote by another user
      }
    }
    
    return newVote;
  }

  // If updating to an upvote, verify the author
  if (voteType === "upvote") {
    const post = await Post.findById(postId);
    if (post && post.author.toString() !== userId) {  // Check if the user is not the author
      await verifyUserIfEligible(post.author.toString());
    }
  }

  return existingVote;
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
