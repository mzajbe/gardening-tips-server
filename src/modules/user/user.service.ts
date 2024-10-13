import QueryBuilder from "../../builder/QueryBuilder";
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


export const userService = {
  createUser,
  getAllUsersFromDB,
  findUserById
}