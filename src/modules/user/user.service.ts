import User from "./user.model";


const createUser = async( userData : any) =>{
  
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


export const userService = {
  createUser,
}