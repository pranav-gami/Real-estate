import { Router } from "express";
import {
  addProperty,
  getProperties,
  getPropertyDataById,
  updatePropertyById,
  deletePropery,
} from "../../controller/propertyController";
import {
  validateParamsID,
  validatePropertyBody,
} from "../../validations/validator";
import { upload } from "../../middleware/uploadMulter";

const router = Router();

// PROPERTIES API'S ENDPOINTS
router.post("/add", validatePropertyBody, upload.array("images"), addProperty);
router.get("/get", getProperties);
router.get("/get/:id", validateParamsID, getPropertyDataById);
router.put(
  "/update/:id",
  validateParamsID,
  validatePropertyBody,
  upload.array("images"),
  updatePropertyById
);
router.delete("/delete/:id", validateParamsID, deletePropery);

export default router;
