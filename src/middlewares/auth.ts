import httpStatus from "http-status-codes";
import AppError from "../error/AppError";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../modules/user/user.model";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.authorization;

    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    //check if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    // check if the token is valid

    jwt.verify(
      token,
      config.jwt_access_secret as string,
      async function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        }

        // Debugging: Log the decoded token to check the payload
        //  console.log("Decoded token:", decoded);

        // req.user = decoded as JwtPayload;

        //testing on
        const email = (decoded as JwtPayload).email; // Assuming you store the email in the token

        // Debugging: Check if the email exists in the token
        // console.log("Extracted email:", email);

        if (!email) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "No email found in token"
          );
        }

        const user = await User.findOne({ email: email });

        // Debugging: Log the user found or null
        // console.log("User found in DB:", user)

        if (!user) {
          throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
        }

        req.user = user;
        next();
      }
    );
  });
};

export default auth;
