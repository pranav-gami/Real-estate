import { Router } from "express";
import {
  loginAdmin,
  logoutUser,
  loginUser,
} from "../../controller/authController";
import { validateLoginBody } from "../../validations/validator";
import { verifyToken } from "../../middleware/authMiddleware";

const router = Router();

router.post("/admin/login", loginAdmin);
router.post("/login", validateLoginBody, loginUser);
router.post("/logout", verifyToken, logoutUser);

export default router;
