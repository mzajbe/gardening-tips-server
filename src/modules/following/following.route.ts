

import express from "express";
import { checkFollowStatus, followUser, getFollowers, getFollowing, unfollowUser } from "./following.controller";


const router = express.Router();

// Follow a user
router.post("/", followUser);

// Unfollow a user
router.delete("/unfollow", unfollowUser);

// Get followers of a user
router.get("/:userId", getFollowers);

// Get users a user is following
router.get("/following/:userId", getFollowing);

router.get('/status/:followerId/:followingId', checkFollowStatus);

export const FollowRoutes = router;
