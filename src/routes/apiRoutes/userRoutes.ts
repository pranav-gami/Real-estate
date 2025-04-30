import { Router } from "express";
import {
  addUser,
  deleteUserById,
  getAllUserData,
  getUserDataById,
  updateUserById,
} from "../../controller/userController";
import {
  validateParamsID,
  validateUserBody,
} from "../../validations/validator";
import { upload } from "../../middleware/uploadMulter";

const router = Router();

router.post("/add", validateUserBody, upload.single("image"), addUser);
router.get("/get", getAllUserData);
router.get("/get/:id", validateParamsID, getUserDataById);
router.put(
  "/update/:id",
  validateParamsID,
  validateUserBody,
  upload.single("image"),
  updateUserById
);
router.delete("/delete/:id", validateParamsID, deleteUserById);

export default router;
