import express from "express";

import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { authorizeAdmin } from "../../middlewares/authorizeAdmin";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.get(
  "/admin/overview",
  auth(),
  authorizeAdmin,
  UserControllers.getAdminOverview
);

router.get("/:id", UserControllers.findUserById);

router.patch(
  "/:id",
  multerUpload.single("profilePicture"),
  UserControllers.updateUserProfile
);

export const UserRoutes = router;
