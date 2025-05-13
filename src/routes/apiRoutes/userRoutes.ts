import { Router } from "express";
import {
  addUser,
  deleteUserById,
  getAllUserData,
  getUserDataById,
  updateStatus,
  updateUserById,
} from "../../controller/userController";
import {
  validateParamsID,
  validateUserBody,
} from "../../validations/validator";
import { upload } from "../../middleware/uploadMulter";
import { verifyToken } from "../../middleware/authMiddleware";

const router = Router();

router.post("/add", validateUserBody, upload.single("image"), addUser);
router.get("/get", verifyToken, getAllUserData);
router.get("/get/:id", verifyToken, validateParamsID, getUserDataById);
router.put(
  "/update/:id",
  validateParamsID,
  verifyToken,
  validateUserBody,
  upload.single("image"),
  updateUserById
);
router.put("/updatestatus/:id", validateParamsID, verifyToken, updateStatus);
router.delete("/delete/:id", validateParamsID, verifyToken, deleteUserById);

export default router;
    