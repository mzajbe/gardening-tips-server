import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { FavouriteRoutes } from "../modules/favourite/favourite.route";
import { FollowRoutes } from "../modules/following/following.route";
import { GroupRoutes } from "../modules/group/group.route";
import { paymentRoute } from "../modules/payment/payment.route";
import { PostRoutes } from "../modules/posts/posts.route";
import { UserRoutes } from "../modules/user/user.route";
import { VideoRoutes } from "../modules/video/video.route";
import { VoteRoutes } from "../modules/vote/vote.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/videos",
    route: VideoRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/votes",
    route: VoteRoutes,
  },
  {
    path: "/follow",
    route: FollowRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/fav",
    route: FavouriteRoutes,
  },
  {
    path: "/groups",
    route: GroupRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
