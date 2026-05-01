import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./posts.interface";
import Post from "./posts.model";

const createPostIntoDB = async (
  payload: Omit<TPost, "createdAt" | "updatedAt" | "isDeleted">,
  images?: TImageFiles
) => {
  if (images && images.itemImages) {
    payload.images = images.itemImages.map((image) => image.path);
  } else {
    payload.images = [];
  }

  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async () => {
  const result = await Post.find().populate("author");
  return result;
};

const getPostFromDB = async (itemId: string) => {
  const result = await Post.findById(itemId);
  // .populate('user')
  // .populate('category');
  return result;
};

export const PostService = {
  createPostIntoDB,
  getAllPostFromDB,
  getPostFromDB,
};
