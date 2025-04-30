import { Router } from "express";
import {
  addUser,
  deleteUserById,
  getAllUserData,
  getUserDataById,
  updateUserById,
} from "../../controller/userController";
import { validateUserBody } from "../../validations/validator";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/add", validateUserBody, upload.single("image"), addUser);
router.get("/get", getAllUserData);
router.get("/get/:id", getUserDataById);
router.put(
  "/update/:id",
  validateUserBody,
  upload.single("image"),
  updateUserById
);
router.delete("/delete/:id", deleteUserById);

export default router;
