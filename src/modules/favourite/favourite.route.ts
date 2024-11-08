import express from "express";
import { FavouriteController } from "./favourite.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// auth(),
// auth(),

router.post("/", FavouriteController.addFavourite);
router.delete("/:postId", FavouriteController.removeFavourite);
router.get("/:postId/count", FavouriteController.getFavouriteCount); // Get favorite count for a post
router.get("/:postId",FavouriteController.getFavPost);
router.get("/userfav/:userId",FavouriteController.getFavPostOfUser);
export const FavouriteRoutes = router;
