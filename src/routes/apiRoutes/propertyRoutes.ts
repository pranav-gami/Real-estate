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
import { verifyToken } from "../../middleware/authMiddleware";

const router = Router();

// PROPERTIES API'S ENDPOINTS
router.post(
  "/add",
  verifyToken,
  validatePropertyBody,
  upload.array("images"),
  addProperty
);
router.get("/get", getProperties);
router.get("/get/:id", validateParamsID, verifyToken, getPropertyDataById);
router.put(
  "/update/:id",
  validateParamsID,
  verifyToken,
  validatePropertyBody,
  upload.array("images"),
  updatePropertyById
);
router.delete("/delete/:id", validateParamsID, verifyToken, deletePropery);

export default router;
