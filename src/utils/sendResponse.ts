import { Response } from 'express';

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    // token:string;
    data: T;
  };
type TResponseLogin<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    token:string;
    data: T;
  };
  
  const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data?.statusCode).json({
      success: data.success,
      message: data.message,
      // token:data.token,
      data: data.data,
    });
  };

  export const sendResponseLogin = <T>(res: Response, data: TResponseLogin<T>) => {
    res.status(data?.statusCode).json({
      success: data.success,
      message: data.message,
      statusCode:data.statusCode,
      token:data.token,
      data: data.data,
    });
  };
  
  export default  sendResponse;

