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

const getAllPostFromDB = async (page = 1, limit = 8) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .populate("author")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit),
    Post.countDocuments({ isDeleted: false }),
  ]);

  return { posts, total, page, limit };
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
