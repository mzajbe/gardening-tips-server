import express from "express";

import auth from "../../middlewares/auth";
import { authorizeAdmin } from "../../middlewares/authorizeAdmin";
import { VideoController } from "./video.controller";

const router = express.Router();

router.get("/", VideoController.getAllVideos);
router.get("/:id/related", VideoController.getRelatedVideos);
router.get("/:id", VideoController.getVideoById);
router.post("/:id/view", VideoController.incrementVideoViewCount);

router.post("/", auth(), authorizeAdmin, VideoController.createVideo);
router.patch("/:id", auth(), authorizeAdmin, VideoController.updateVideo);
router.delete("/:id", auth(), authorizeAdmin, VideoController.deleteVideo);

export const VideoRoutes = router;
