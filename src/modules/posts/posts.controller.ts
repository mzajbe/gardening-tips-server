import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./posts.service";
import httpStatus from 'http-status-codes';


const createPost = catchAsync(async (req, res) => {
    const result = await PostService.createPostIntoDB(req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post created successfully",
      data: result,
    });
  });

const getAllPost = catchAsync(async(req,res)=>{
  const result = await PostService.getAllPostFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
})
  
  export const PostControllers = {
    createPost,
    getAllPost,
  };