import { Router } from "express";
import {
  addInquiry,
  getInquiriesData,
  getInquiryDataById,
  deleteInquiry,
  updateInquiryById,
  updateInquiryStatus,
} from "../../controller/inquiryController";
import {
  validateParamsID,
  validateInquiryBody,
} from "../../validations/validator";

const router = Router();

// INQUIRY API'S ENDPOINTS(Routes)

router.post("/add", validateInquiryBody, addInquiry);
router.get("/get", getInquiriesData);
router.get("/get/:id", validateParamsID, getInquiryDataById);
router.put(
  "/update/:id",
  validateParamsID,
  validateInquiryBody,
  updateInquiryById
);
router.put("/updatestatus/:id", validateParamsID, updateInquiryStatus);
router.delete("/delete/:id", validateParamsID, deleteInquiry);

export default router;
