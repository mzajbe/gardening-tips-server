import express from "express";
import { PostControllers } from "./posts.controller";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
  "/create",
//   multerUpload.fields([{ name: "itemImages" }]),
  PostControllers.createPost
);
router.get("/", PostControllers.getAllPost);
router.get("/:id",PostControllers.getPost);
router.get("/user-posts/:id",PostControllers.getPostsByUser);

export const PostRoutes = router;
