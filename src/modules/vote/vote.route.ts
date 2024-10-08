import express from "express";
import { VoteController } from "./vote.controller";
import auth from "../../middlewares/auth";


const router = express.Router();

router.post('/',auth(), VoteController.castVote);
router.get('/:postId',VoteController.getVotesCount);

export const VoteRoutes = router;