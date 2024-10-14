import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { CommentService } from "./comment.service";

// Create a new comment
const createComment = catchAsync(async (req, res) => {
  const { postId, content } = req.body;
  console.log(req.body);
  
  const userId = req.body.userId; // Get user ID from token

//   console.log(userId);
  

  const comment = await CommentService.createComment(postId, userId, content);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

// Get comments for a post
const getCommentsByPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await CommentService.getCommentsByPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});

// Edit a comment
const editComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.body.userId;

  

  const updatedComment = await CommentService.editComment(commentId, userId, content);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
});

// Delete a comment
const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
//   console.log(req.params);
  
  const userId = req.body.userId;

  await CommentService.deleteComment(commentId, userId);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment deleted successfully",
      data: undefined
  });
});

export const CommentController = {
  createComment,
  getCommentsByPost,
  editComment,
  deleteComment,
};
