import { Request, Response } from "express";
import {
  createBooking,
  getBookingData,
  updateBookingData,
  updateStatus,
  deleteBooking,
} from "../services/bookingService";

// ADD-BOOKING CONTROLLER

export const addBooking = async (req: Request, res: Response) => {
  try {
    const book = await createBooking(req);
    res.status(200).json({
      success: true,
      data: book,
      message: "Successfully Booked",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET BOOKING-DATA CONTROLLER
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookingData = await getBookingData(req, true);
    res.status(200).json({ success: true, data: bookingData });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// BOOKINGDATA-ID CONTROLLER

export const getBookingDataById = async (req: Request, res: Response) => {
  try {
    const bookingData = await getBookingData(req, false);
    res.status(200).json({ success: true, data: bookingData });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE-BOOKING CONTROLLER

export const updateBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await updateBookingData(req);
    res
      .status(200)
      .json({ success: true, data: booking, message: "Updated Successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

//UPDATE STATUS-CONTROLLER

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const booking = await updateStatus(req);
    res.status(200).json({
      success: true,
      data: booking,
      message: "Status Updated Successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE-BOOKING CONTROLLER

export const deleteBookingById = async (req: Request, res: Response) => {
  try {
    await deleteBooking(req);
    res
      .status(200)
      .json({ success: true, message: "Booking cleared successfully." });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
