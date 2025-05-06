import { Router } from "express";

import authRouter from "./apiRoutes/authRoutes";
import userRouter from "./apiRoutes/userRoutes";
import addressRouter from "./apiRoutes/addressRoutes";
import propertyRouter from "./apiRoutes/propertyRoutes";
import inquiryRouter from "./apiRoutes/inquiryRoutes";
import bookingRouter from "./apiRoutes/bookingRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/address", addressRouter);
router.use("/property", propertyRouter);
router.use("/inquiry", inquiryRouter);
router.use("/booking", bookingRouter);

export default router;
