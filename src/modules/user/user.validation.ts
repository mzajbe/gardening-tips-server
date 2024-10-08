import { z } from "zod";

export const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
  profilePicture: z.string().optional(),
  followers: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
  isVerified: z.boolean(),
  isPremium: z.boolean(),
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'." }),
  }),

});
