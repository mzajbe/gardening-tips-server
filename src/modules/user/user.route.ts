import express from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

// router.post('/signup',UserControllers.signUp);

router.get(
    '/:id',
    // auth(USER_ROLE.admin, USER_ROLE.driver, USER_ROLE.user),
    UserControllers.findUserById,
  );


export const UserRoutes = router;