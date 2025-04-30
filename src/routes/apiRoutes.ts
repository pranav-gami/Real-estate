import { Router } from "express";

// import authRouter from "./apiRoutes/authRoutes";
import userRouter from "./apiRoutes/userRoutes";
import addressRouter from "./apiRoutes/addressRoutes";

const router = Router();

// router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/address", addressRouter);

export default router;
