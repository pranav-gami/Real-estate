import { Request, Response } from "express";
import {
  createInquiry,
  getInquiryData,
  updateInquiryData,
  deleteInquiryById,
  updateStatus,
} from "../services/inquiryService";

// ADD-INQUIRY CONTROLLER

export const addInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await createInquiry(req);
    res.status(200).json({
      success: true,
      data: inquiry,
      message: "Inquiry Raised Successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ error: "Some Error Occured!!" });
    }
  }
};

// GET INQUIRY-DATA CONTROLLER

export const getInquiriesData = async (req: Request, res: Response) => {
  try {
    const inquiryData = await getInquiryData(req, true);
    res.status(200).json({ success: true, data: inquiryData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// INQUIRYDATA-ID CONTROLLER

export const getInquiryDataById = async (req: Request, res: Response) => {
  try {
    const inquiryData = await getInquiryData(req, false);
    res.status(200).json({ success: true, data: inquiryData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-INQUIRY CONTROLLER

export const updateInquiryById = async (req: Request, res: Response) => {
  try {
    const inquiry = await updateInquiryData(req);
    res
      .status(200)
      .json({ success: true, data: inquiry, message: "Updated Successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

//UPDATE STATUS-CONTROLLER

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const inquiry = await updateStatus(req);
    res.status(200).json({
      success: true,
      data: inquiry,
      message: "Status Updated Successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// DELETE-INQUIRY CONTROLLER

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    await deleteInquiryById(req);
    res
      .status(200)
      .json({ success: true, message: "Inquiry cleared successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};
