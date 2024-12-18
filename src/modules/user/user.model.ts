import mongoose, { Schema, Document, model } from "mongoose";
import { IUserModel, TUser } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";


// type UserDocument = TUser & Document;

const UserSchema: Schema<TUser,IUserModel> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    profilePicture: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true, 
  }
);

//password hashing middleware

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//static method
UserSchema.statics.isUserExistsByEmail = async function(email:string){
  return await User.findOne({email});
}

UserSchema.statics.isPasswordMatched = async function(plainTestPassword,hashedPassword){
  return await bcrypt.compare(
    plainTestPassword,
    hashedPassword,
);
}

const User = model<TUser,IUserModel>("User", UserSchema);

export default User;