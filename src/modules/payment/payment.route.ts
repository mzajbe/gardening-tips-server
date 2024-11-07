import { Router } from "express";
import { paymentController } from "./payment.controller";


const router = Router();

router.get("/:id", paymentController.paymentURL);
router.post('/confirmation/:id',paymentController.confirmationController);
router.post('/fail',paymentController.paymentFailedController);

export const paymentRoute = router;
