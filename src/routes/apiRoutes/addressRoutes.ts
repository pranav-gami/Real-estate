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

const router = Router();

router.post("/add", validateAddressBody, addAddress);
router.get("/get", getAllAddressData);
router.get("/get/:id", validateParamsID, getAddressDataById);
router.put(
  "/update/:id",
  validateParamsID,
  validateAddressBody,
  updateAddressById
);
router.delete("/delete/:id", validateParamsID, deleteAdressdById);

export default router;
