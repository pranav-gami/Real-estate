import { Request, Response } from "express";
import {
  createProperty,
  getPropertyData,
  updatePropertyData,
  deletePropertyById,
} from "../services/propertyService";

// ADD PROPERTY CONTROLLER

export const addProperty = async (req: Request, res: Response) => {
  try {
    const property = await createProperty(req);
    res.status(200).json({
      success: true,
      data: property,
      message: "Property Added Successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res
        .status(400)
        .json({ error: "Some Error Occured in creating Property!!" });
    }
  }
};

// GET PROPERTY-DATA CONTROLLER

export const getProperties = async (req: Request, res: Response) => {
  try {
    const propertyData = await getPropertyData(req, true);
    res.status(200).json({ success: true, data: propertyData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// CATEGORYDATA-ID CONTROLLER

export const getPropertyDataById = async (req: Request, res: Response) => {
  try {
    const propertyData = await getPropertyData(req, false);
    res.status(200).json({ success: true, data: propertyData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-PROPERTY CONTROLLER

export const updatePropertyById = async (req: Request, res: Response) => {
  try {
    const property = await updatePropertyData(req);
    res
      .status(200)
      .json({ success: true, data: property, message: "Updated Successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-PROPERTY CONTROLLER

export const deletePropery = async (req: Request, res: Response) => {
  try {
    await deletePropertyById(req);
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};
