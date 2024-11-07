import express from "express";
import { UserControllers } from "./user.controller";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// router.post('/signup',UserControllers.signUp);

router.get(
  "/:id",
  // auth(USER_ROLE.admin, USER_ROLE.driver, USER_ROLE.user),
  UserControllers.findUserById
);

router.patch(
  "/:id",
  multerUpload.single("profilePicture"), // Handle file upload for the "profilePicture" field
  UserControllers.updateUserProfile
);

// router.patch("/verify/:id", UserControllers.verifyUser);

export const UserRoutes = router;
