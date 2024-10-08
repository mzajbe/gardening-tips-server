import express from "express";
import { PostControllers } from "./posts.controller";

const router = express.Router();

router.post("/create", PostControllers.createPost);
router.get("/",PostControllers.getAllPost);

export const PostRoutes = router;