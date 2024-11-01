import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./posts.interface";
import Post from "./posts.model";

const createPostIntoDB = async (
  payload: Omit<TPost, "createdAt" | "updatedAt" | "isDeleted">,
  images: TImageFiles
) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async () => {
  const result = await Post.find().populate("author", "name");
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
