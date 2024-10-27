// import bcryptJs from "bcryptjs";

// import { TLoginUsr, TSignupUser } from "./auth.interface";
// import AppError from "../../error/AppError";
// import httpStatus from "http-status-codes";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../../config";
// import { createToken, verifyToken } from "./auth.utils";
// import User from "../user/user.model";
// import { USER_ROLE } from "../user/user.constant";

// const signUpUser = async (payload: TSignupUser) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(payload?.email);

//   if (user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is already exist!");
//   }

//   // payload.role = USER_ROLE.USER;

//   //create new user
//   const newUser = await User.create(payload);

//   //create token and sent to the  client

//   const jwtPayload = {
//     // _id: newUser._id,
//     // name: newUser.name,
//     email: newUser.email,
//     role: newUser.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
// };

// const loginUser = async (payload: TLoginUsr) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(payload?.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
//   }

//   // checking if the user is blocked

//   // const userStatus = user?.status;

//   // if (userStatus === 'BLOCKED') {
//   //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
//   // }

//   //checking if the password is correct

//   if (!(await User.isPasswordMatched(payload?.password, user?.password)))
//     throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

//   //create token and sent to the  client

//   const jwtPayload = {
//     // _id: user._id,
//     // name: user.name,
//     email: user.email,
//     // mobileNumber: user.mobileNumber,
//     role: user.role,
//     // status: user.status,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
// };

// // const signUpUser = async(userData:TLoginUsr) =>{
// //   if(userData.password){
// //     userData.password = await bcryptJs.hash(
// //       userData.password,
// //       Number(config.bcrypt_salt_rounds),
// //     );
// //   }
// //   const user = await User.create({
// //     ...userData,
// //     role:USER_ROLE.user,
// //   });
// //   return user;
// // }

// // const loginUser = async (payload:TLoginUsr)=>{

// //   const user = await User.findOne({ email: payload.email });
// //   if(!user){
// //     const user = await signUpUser(payload);

// //     const jwtPayload = {
// //       email: user.email,
// //       role: user.role,
// //     };

// //     const accessToken = createToken(
// //       jwtPayload,
// //       config.jwt_access_secret as string,
// //       config.jwt_access_expires_in as string,
// //     );

// //     const refreshToken = createToken(
// //       jwtPayload,
// //       config.jwt_refresh_secret as string,
// //       config.jwt_refresh_expires_in as string,
// //     );

// //     return {
// //       accessToken,
// //       refreshToken,
// //     };
// //   }else{
// //     if(payload.password){
// //       const isPasswordMatched = await bcryptJs.compare(
// //         payload.password,
// //         user.password,
// //       );

// //       if (!isPasswordMatched) {
// //         throw new AppError(httpStatus.NOT_FOUND, 'Password Incorrect!');
// //       }
// //     }
// //     const jwtPayload = {
// //       email: user.email,
// //       role: user.role,
// //       _id: user._id,
// //     };
// //     const accessToken = createToken(
// //       jwtPayload,
// //       config.jwt_access_secret as string,
// //       config.jwt_access_expires_in as string,
// //     );

// //     const refreshToken = createToken(
// //       jwtPayload,
// //       config.jwt_refresh_secret as string,
// //       config.jwt_refresh_expires_in as string,
// //     );

// //     return {
// //       accessToken,
// //       refreshToken,
// //     };
// //   }
// // };

// const refreshToken = async (token: string) => {
//   // checking if the given token is valid
//   const decoded = verifyToken(token, config.jwt_refresh_secret as string);

//   const { email } = decoded;

//   // checking if the user is exist
//   const user = await User.findOne({ email: email });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
//   }

//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   return {
//     accessToken,
//   };
// };

// // const refreshToken = async (token:string)=>{

// //   const decoded = jwt.verify(
// //     token,
// //     config.jwt_refresh_secret as string,
// //   ) as JwtPayload;

// //   const { userEmail, iat } = decoded;

// //   // checking if the user is exist
// //   const user = await User.isUserExistsByEmail(email);

// //   if (!user) {
// //     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
// //   }

// //   const jwtPayload = {
// //     email: user.email,
// //     role: user.role,
// //     userId: user._id,
// //   };

// //   const accessToken = createToken(
// //     jwtPayload,
// //     config.jwt_access_secret as string,
// //     config.jwt_access_expires_in as string,
// //   );

// //   return {
// //     accessToken,
// //   };

// // };

// export const AuthServices = {
//   signUpUser,
//   loginUser,
//   refreshToken,
// };



import  bcryptJs  from 'bcryptjs';


import { TLoginUsr } from "./auth.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import User from "../user/user.model";
import { USER_ROLE } from '../user/user.constant';




const signUpUser = async(userData:TLoginUsr) =>{
  if(userData.password){
    userData.password = await bcryptJs.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  const user = await User.create({
    ...userData,
    role:USER_ROLE.USER,
  });
  return user;
}


// const loginUser = async (payload: TLoginUsr) => {
//   //checking if the user is exist
//   // const user = await User.isUserExistsByEmail(payload.email);
//   const user = await User.findOne({ email: payload.email });
//   if (!user) {
//     // Handle the case where the user does not exist
//     // throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");

//     const jwtpayload = {
//       email: user.email,
//       role:user.role,
//     }
//   }

//   //check if the password is correct

//   if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
//     throw new AppError(httpStatus.FORBIDDEN, "Password do not matched !");
//   }

//   //create token and sent to the client

//   const jwtPayload = {
//     userEmail: user.email,
//     role: user.role,
//     userId: user._id,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   // jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//   //   expiresIn: "1d",
//   // });

//   //refresh token
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string
//   );

//   // jwt.sign(
//   //   jwtPayload,
//   //   config.jwt_refresh_secret as string,
//   //   {
//   //     expiresIn: "10d",
//   //   }
//   // )

//   return {
//     accessToken,
//     refreshToken,
//     data: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   };
// };

const loginUser = async (payload:TLoginUsr)=>{
  
  const user = await User.findOne({ email: payload.email });
  if(!user){
    const user = await signUpUser(payload);

    const jwtPayload = {
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }else{
    if(payload.password){
      const isPasswordMatched = await bcryptJs.compare(
        payload.password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new AppError(httpStatus.NOT_FOUND, 'Password Incorrect!');
      }
    }
    const jwtPayload = {
      email: user.email,
      role: user.role,
      _id: user._id,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
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

// const refreshToken = async (token:string)=>{

//   const decoded = jwt.verify(
//     token,
//     config.jwt_refresh_secret as string,
//   ) as JwtPayload;

//   const { userEmail, iat } = decoded;

//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }

//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//     userId: user._id,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   return {
//     accessToken,
//   };



// };



export const AuthServices = {
  signUpUser,
  loginUser,
  refreshToken
};
