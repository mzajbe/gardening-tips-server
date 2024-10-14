import { multerUpload } from "../../config/multer.config";
import AppError from "../../error/AppError";
import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Post from "./posts.model";
import { PostService } from "./posts.service";
import httpStatus from 'http-status-codes';


const createPost = catchAsync(async (req, res) => {
  // if (!req.files) {
  //   throw new AppError(400, 'Please upload an image');
  // }

    const result = await PostService.createPostIntoDB(req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post created successfully",
      data: result,
    });
  });

// Handle post creation with image upload
// const createPost = [
//   multerUpload.single("image"), // Use multer to handle image upload
//   catchAsync(async (req, res) => {

//     // Log the uploaded file
//     console.log("File received:", req.file);

//     // Multer adds the file information to req.file
//     const imageUrl = req.file?.path; // This is the Cloudinary URL after upload

//     // Combine image URL with the rest of the post data
//     const postPayload = {
//       ...req.body,
//       images: imageUrl ? [imageUrl] : [], // Add image URL if available
//     };

//     // Log the post payload before sending to the service
//     console.log("Post payload:", postPayload);

//     // Create post in the database
//     const result = await PostService.createPostIntoDB(postPayload);

//     // console.log(result);
    

//     // Send response
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Post created successfully",
//       data: result,
//     });
//   }),
// ];



const getAllPost = catchAsync(async(req,res)=>{
  const result = await PostService.getAllPostFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
})

const getPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const result = await PostService.getPostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const getPostsByUser = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;

  // Log the userId to ensure it's being passed correctly
  console.log("userId passed in URL:", userId);

  // Find posts that belong to the user (using 'author' instead of 'user')
  const posts = await Post.find({ author: userId }).populate("author"); // Populating the author field

  // Log the posts to see if they are retrieved correctly
  console.log("Posts found:", posts);

  if (!posts || posts.length === 0) {
    return next(new AppError(httpStatus.NOT_FOUND, "No posts found"));
  }

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: posts,
  });
});


const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { userId, content, title } = req.body; // Adjust based on your post structure

  // Find the post to ensure it belongs to the user
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError(httpStatus.NOT_FOUND, "Post not found"));
  }

  // Check if the user making the request is the post author
  if (post.author.toString() !== userId) {
    return next(new AppError(httpStatus.UNAUTHORIZED, "You can only edit your own posts"));
  }

  // Update post content
  post.content = content || post.content; // Update content only if provided
  post.title = title || post.title; // Update title if provided

  await post.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: post,
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { userId } = req.body;

  // Find the post to ensure it belongs to the user
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError(httpStatus.NOT_FOUND, "Post not found"));
  }

  // Check if the user making the request is the post author
  if (post.author.toString() !== userId) {
    return next(new AppError(httpStatus.UNAUTHORIZED, "You can only delete your own posts"));
  }

  // Delete the post
  await Post.deleteOne({ _id: postId });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data:undefined
  });
});




  
  export const PostControllers = {
    createPost,
    getAllPost,
    getPost,
    getPostsByUser,
    updatePost,
    deletePost
  };