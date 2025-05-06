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
router.put("/updatestatus/:id", validateParamsID, updateStatus);
router.delete("/delete/:id", validateParamsID, deleteUserById);

export default router;
