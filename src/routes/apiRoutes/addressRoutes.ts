import { Router } from "express";
import {
  validateParamsID,
  validateAddressBody,
} from "../../validations/validator";
import {
  addAddress,
  getAllAddressData,
  getAddressDataById,
  updateAddressById,
  deleteAdressdById,
} from "../../controller/addressController";
import { verifyToken } from "../../middleware/authMiddleware";

const router = Router();

router.post("/add", verifyToken, validateAddressBody, addAddress);
router.get("/get", verifyToken, getAllAddressData);
router.get("/get/:id", validateParamsID, verifyToken, getAddressDataById);
router.put(
  "/update/:id",
  validateParamsID,
  verifyToken,
  validateAddressBody,
  updateAddressById
);
router.delete("/delete/:id", validateParamsID, verifyToken, deleteAdressdById);

export default router;
