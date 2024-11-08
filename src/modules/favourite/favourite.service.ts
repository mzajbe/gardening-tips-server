import FavouriteModel from "./favourite.model";
import { TFavourite } from "./favourite.interface";
import Post from "../posts/posts.model";

const addFavourite = async (
  postId: string,
  userId: string
): Promise<TFavourite | null> => {
  const existingFavourite = await FavouriteModel.findOne({ postId, userId });

  if (existingFavourite) {
    return existingFavourite; // If already favorited, return the existing favorite
  }

  // Create a new favorite
  const newFavourite = await FavouriteModel.create({ postId, userId });
  return newFavourite;
};

const removeFavourite = async (
  postId: string,
  userId: string
): Promise<void> => {
  await FavouriteModel.findOneAndDelete({ postId, userId });
};

const getFavouriteCount = async (postId: string): Promise<number> => {
  return await FavouriteModel.countDocuments({ postId });
};

const getFavFromDB = async (postId: string) => {
  const result = await FavouriteModel.findOne({ postId });
  // .populate('user')
  // .populate('category');
  return result;
};

const getFavPostOfUserFromDB = async (userId: string) => {
  const result = await FavouriteModel.find({ userId });

  return result;
};

export const FavouriteService = {
  addFavourite,
  removeFavourite,
  getFavouriteCount,
  getFavFromDB,
  getFavPostOfUserFromDB,
};
