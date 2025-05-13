import { Request } from "express";
import Inquiry from "../models/inquiry.model";
import Property from "../models/property.model";
import User from "../models/user.model";

// ADD-INQUIRY SERVICE

export const createInquiry = async (req: Request) => {
  try {
    const { propertyId, userId, message } = req.body;

    // CONDITIONS AND VALIDATIONS
    const data = await Property.findById(propertyId);

    if (userId == data?.ownerId) {
      throw new Error("You Can't send Inquiry to YOur Own Property!");
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found.");
    }
    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      throw new Error("Property not found.");
    }

    const inquiry = await Inquiry.create({
      propertyId,
      userId,
      message,
    });
    return inquiry;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error(
        "You have already submitted an inquiry for this property"
      );
    }
    throw new Error(err.message);
  }
};

//INQUIRY-DATA SERVICE

export const getInquiryData = async (req: Request, all: Boolean) => {
  try {
    if (all) {
      const inquiryData = await Inquiry.find({});
      if (inquiryData.length == 0) {
        throw new Error("No any Inquiries!");
      }
      return inquiryData;
    }
    const inquiryId = req.params.id;
    const inquiryData = await Inquiry.findById(inquiryId);
    if (!inquiryData) {
      throw new Error("Requested Inquiry not Found !");
    }
    return inquiryData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured..");
    }
  }
};

// UPDATE-INQUIRY SERVICE

export const updateInquiryData = async (req: Request) => {
  try {
    const inquiryId = req.params.id;
    const isExists = await Inquiry.findById(inquiryId);
    if (!isExists) {
      throw new Error("Inquiry you are trying to update is not found !");
    }

    const { propertyId, userId, message } = req.body;

    // CONDITIONS AND VALIDATIONS CHECK
    const data = await Property.findById(propertyId);
    if (userId == data?.ownerId) {
      throw new Error("Buyer and Seller Can't be Same!");
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found !");
    }
    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      throw new Error("Property not found !");
    }

    const response = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        $set: { propertyId, userId, message },
      },
      { new: true }
    );
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured in Updating Inquiry...");
    }
  }
};

// DELETE-INQUIRY SERVICE

export const deleteInquiryById = async (req: Request) => {
  try {
    const inquiryId = req.params.id;
    if (!(await Inquiry.findById(inquiryId))) {
      throw new Error("Inquiry not found..");
    }
    const response = await Inquiry.findByIdAndDelete(inquiryId);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while deleting Inquiry..");
    }
  }
};
