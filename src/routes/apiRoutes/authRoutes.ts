import { Router } from "express";
import {
  // loginAdmin,
  logoutUser,
  loginUser,
} from "../../controller/authController";
import { validateLoginBody } from "../../validations/validator";

const router = Router();

// router.post("/admin/login", loginAdmin);
router.post("/login", validateLoginBody, loginUser);
router.post("/logout", logoutUser);

export default router;
