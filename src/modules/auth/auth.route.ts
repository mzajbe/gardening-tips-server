import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidation.signupValidationSchema),
    AuthControllers.signUpUser,
);

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/google-login',
    validateRequest(AuthValidation.googleLoginValidationSchema),
    AuthControllers.googleLogin,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const AuthRoutes = router;