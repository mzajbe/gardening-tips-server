

import { TComment } from "./comment.interface";
import CommentModel from "./comment.model";

/**
 * Create a new comment for a post
 */
const createComment = async (postId: string, userId: string, content: string): Promise<TComment> => {

 
    
  const comment = await CommentModel.create({ postId, userId, content });
  
  
  return comment;
};

/**
 * Get all comments for a specific post
 */
const getCommentsByPost = async (postId: string): Promise<TComment[]> => {
  return await CommentModel.find({ postId }).populate("userId");
};

/**
 * Edit an existing comment
 */
const editComment = async (commentId: string, userId: string, content: string): Promise<TComment | null> => {
  const updatedComment = await CommentModel.findOneAndUpdate(
    { _id: commentId, userId },
    { content, updatedAt: Date.now() },
    { new: true }
  );
  return updatedComment;
};

/**
 * Delete a comment
 */
const deleteComment = async (commentId: string, userId: string): Promise<TComment | null> => {
  return await CommentModel.findOneAndDelete({ _id: commentId, userId });
};

export const CommentService = {
  createComment,
  getCommentsByPost,
  editComment,
  deleteComment,
};


