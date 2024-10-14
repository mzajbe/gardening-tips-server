import express from "express";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", CommentController.createComment);
router.get("/:postId", CommentController.getCommentsByPost);
router.put("/:commentId", CommentController.editComment);
router.delete("/:commentId", CommentController.deleteComment);

export const CommentRoutes = router;