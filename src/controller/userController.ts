import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserData,
  updateUserData,
} from "../services/userService";

// CREATE USER CONTROLLER

export const addUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req);
    res.status(200).json({
      success: true,
      data: user,
      message: "Register Successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ error: "Some Error Occured!!" });
    }
  }
};

// GETUESRDATA CONTROLLER

export const getAllUserData = async (req: Request, res: Response) => {
  try {
    const userData = await getUserData(req, true);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// USERDATA-ID CONTROLLER

export const getUserDataById = async (req: Request, res: Response) => {
  try {
    const userData = await getUserData(req, false);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-USER CONTROLLER

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await updateUserData(req);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};

// UPDATE-USER CONTROLLER

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await deleteUser(req);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Some Error Occured!!" });
    }
  }
};
