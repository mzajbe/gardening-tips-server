
import { TLoginUsr } from "./auth.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import User from "../user/user.model";


const loginUser = async (payload: TLoginUsr) => {
  //checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    // Handle the case where the user does not exist
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  //check if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched !");
  }

  //create token and sent to the client

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // jwt.sign(jwtPayload, config.jwt_access_secret as string, {
  //   expiresIn: "1d",
  // });

  //refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // jwt.sign(
  //   jwtPayload,
  //   config.jwt_refresh_secret as string,
  //   {
  //     expiresIn: "10d",
  //   }
  // )

  return {
    accessToken,
    refreshToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


const refreshToken = async (token:string)=>{

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userEmail, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };



};

export const AuthServices = {
  loginUser,
  refreshToken
};
