import { Router } from "express";
import {
  addBooking,
  getBookings,
  getBookingDataById,
  updateBookingById,
  updateBookingStatus,
  deleteBookingById,
} from "../../controller/bookingController";
import {
  validateParamsID,
  validateBookingBody,
} from "../../validations/validator";

const router = Router();

router.post("/add", validateBookingBody, addBooking);
router.get("/get", getBookings);
router.get("/get/:id", validateParamsID, getBookingDataById);
router.put("/update/:id", validateParamsID, updateBookingById);
router.put("/updatestatus/:id", validateParamsID, updateBookingStatus);
router.delete("/delete/:id", validateParamsID, deleteBookingById);

export default router;
