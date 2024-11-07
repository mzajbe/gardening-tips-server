import QueryBuilder from "../../builder/QueryBuilder";
import Post from "../posts/posts.model";
import VoteModel from "../vote/vote.model";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import User from "./user.model";


const createUser = async( userData : TUser) =>{
  
  //Ensure the role is set to 'user' by default
  const role = userData.role || 'user';

  const newUser = await User.create({...userData,role});
  
  return{
    _id:newUser._id,
    name:newUser.name,
    email:newUser.email,
    role:newUser.role,
  };
};


const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

const updateUserProfile = async (userId: string, updatedData: Partial<TUser>) => {
  // Only allow updates for name and profilePicture fields
  const { name, profilePicture } = updatedData;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), ...(profilePicture && { profilePicture }) },
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    throw new Error("User not found or update failed");
  }

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
  };
};




export const userService = {
  createUser,
  getAllUsersFromDB,
  findUserById,
  updateUserProfile,
}