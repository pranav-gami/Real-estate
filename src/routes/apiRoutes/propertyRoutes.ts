import { Router } from "express";
import {
  addProperty,
  getProperties,
  getPropertyDataById,
  updatePropertyById,
  deletePropery,
} from "../../controller/propertyController";
import { validatePropertyBody } from "../../validations/validator";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/add", validatePropertyBody, upload.array("image"), addProperty);
router.get("/get", getProperties);
router.get("/get/:id", getPropertyDataById);
router.put(
  "/update/:id",
  validatePropertyBody,
  upload.array("image"),
  updatePropertyById
);
router.delete("/delete/:id", deletePropery);

export default router;
