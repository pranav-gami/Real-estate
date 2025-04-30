import { Router } from "express";
import { validateAddressBody } from "../../validations/validator";
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
router.get("/get/:id", getAddressDataById);
router.put("/update/:id", validateAddressBody, updateAddressById);
router.delete("/delete/:id", deleteAdressdById);

export default router;
