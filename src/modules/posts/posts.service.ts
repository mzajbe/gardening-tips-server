import { TPost } from "./posts.interface";
import Post from "./posts.model";



const createPostIntoDB = async (payload: Omit<TPost, "createdAt" | "updatedAt" | "isDeleted">) => {
    const result = await Post.create(payload);
    return result;
  };

const getAllPostFromDB = async() => {
  const result = await Post.find().populate('author','name');
  return result;
}
  
  export const PostService = {
    createPostIntoDB,
    getAllPostFromDB
  };