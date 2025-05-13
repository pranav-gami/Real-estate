import { Router } from "express";
import {
  addInquiry,
  getInquiriesData,
  getInquiryDataById,
  deleteInquiry,
  updateInquiryById,
  // updateInquiryStatus,
} from "../../controller/inquiryController";
import {
  validateParamsID,
  validateInquiryBody,
} from "../../validations/validator";
import { verifyToken } from "../../middleware/authMiddleware";

const router = Router();

// INQUIRY API'S ENDPOINTS(Routes)

router.post("/add", validateInquiryBody, verifyToken, addInquiry);
router.get("/get", verifyToken, getInquiriesData);
router.get("/get/:id", validateParamsID, verifyToken, getInquiryDataById);
router.put(
  "/update/:id",
  validateParamsID,
  verifyToken,
  validateInquiryBody,
  updateInquiryById
);
// router.put(
//   "/updatestatus/:id",
//   validateParamsID,
//   verifyToken,
//   updateInquiryStatus
// );
router.delete("/delete/:id", validateParamsID, verifyToken, deleteInquiry);

export default router;
