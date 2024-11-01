import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    img: z.string().optional(),
    email: z.string({ required_error: 'Id is required.' }),
    password: z.string().optional(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const signupValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    role: z.enum(['user', 'ADMIN']),
    // img: z.string().optional(),
  }),
});

export const AuthValidation = {
  signupValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema
};