import { Request, Response } from "express";
import {
  insertAddress,
  getAddressData,
  updateAddressData,
  deleteAddress,
} from "../services/addressService";

// ADD ADDRESS CONTROLLER

export const addAddress = async (req: Request, res: Response) => {
  try {
    const addr = await insertAddress(req);
    res.status(200).json({ success: true, data: addr });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ error: "Some Error Occured!!" });
    }
  }
};

//ADDRESS-DATA CONTROLLER

export const getAllAddressData = async (req: Request, res: Response) => {
  try {
    const addrData = await getAddressData(req, true);
    res.status(200).json({ success: true, data: addrData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// ADDRESSDATA-ID CONTROLLER

export const getAddressDataById = async (req: Request, res: Response) => {
  try {
    const addrData = await getAddressData(req, false);
    res.status(200).json({ success: true, data: addrData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-ADDRESS CONTROLLER

export const updateAddressById = async (req: Request, res: Response) => {
  try {
    const data = await updateAddressData(req);
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-ADDRESS CONTROLLER

export const deleteAdressdById = async (req: Request, res: Response) => {
  try {
    await deleteAddress(req);
    res
      .status(200)
      .json({ success: true, message: "Address Deleted Successfully.." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};
