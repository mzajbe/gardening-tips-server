import { Model } from "mongoose";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  followers: string[];
  following: string[]; 
  isVerified: boolean; 
  isPremium: boolean;
  role: "user" | "admin";
};


export interface UserModel extends Model<TUser> {
  
  isUserExistsByEmail(email:string): Promise<TUser>;
  
  isPasswordMatched(plainTestPassword : string,hashedPassword: string): Promise<boolean>;
}