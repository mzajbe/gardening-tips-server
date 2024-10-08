import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';


export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming req.user is populated from auth middleware
  
    if (user?.role !== 'admin') {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
  
    next();
  };