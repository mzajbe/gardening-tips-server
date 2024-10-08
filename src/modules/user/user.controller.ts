import { NextFunction, Request, Response } from "express";
import { userValidationSchema } from "./user.validation";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";


const signUp = async (req:Request,res:Response,next:NextFunction)=>{
  try{
    //validation data
    const validationData = userValidationSchema.parse(req.body);

    //create new user
    const result = await userService.createUser(validationData);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"User registered successfully",
      data:result,
    });

  }catch(err){
    next(err);
  }
}

export const UserControllers = {
  signUp,
}