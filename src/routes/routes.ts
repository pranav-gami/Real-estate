import { Router } from "express";

// import authRouter from "./apiRoutes/authRoutes";
import userRouter from "./apiRoutes/userRoutes";
import addressRouter from "./apiRoutes/addressRoutes";
import propertyRouter from "./apiRoutes/propertyRoutes";

const router = Router();

// router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/address", addressRouter);
router.use("/property", propertyRouter);

export default router;
