import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserData,
  updateUserData,
  updateUserStatus,
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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GETUESRDATA CONTROLLER

export const getAllUserData = async (req: Request, res: Response) => {
  try {
    const userData = await getUserData(req, true);
    res.status(200).json({ success: true, data: userData });
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// USERDATA-ID CONTROLLER

export const getUserDataById = async (req: Request, res: Response) => {
  try {
    const userData = await getUserData(req, false);
    res.status(200).json({ success: true, data: userData });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE-USER CONTROLLER

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await updateUserData(req);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const user = await updateUserStatus(req);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE-USER CONTROLLER

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await deleteUser(req);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
