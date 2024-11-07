import express from "express";
import {
  checkFollowStatus,
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "./following.controller";

const router = express.Router();

router.post("/", followUser);

router.delete("/unfollow", unfollowUser);

router.get("/:userId", getFollowers);

router.get("/following/:userId", getFollowing);

router.get("/status/:followerId/:followingId", checkFollowStatus);

export const FollowRoutes = router;
