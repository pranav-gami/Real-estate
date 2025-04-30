import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";

//AUTHENTICATING USER AND TOKEN

// LOGIN ADMIN

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Not Found!" });
    }
    const isPassMatch = bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password do not match!!" });
    }
    if (user.role != "ADMIN") {
      return res
        .status(401)
        .json({ success: false, message: "Only Admin can Login here" });
    }
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "helloAdmin",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, user, token });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// LOGIN USER

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not Found!" });
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password do not match!!" });
    }
    if (user.role != "USER") {
      return res
        .status(401)
        .json({ success: false, message: "Only User can Login here" });
    }
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "helloAdmin",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user, token });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//LOGOUT-CONTROLLER

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({
      success: true,
      message: "Already logged out.",
    });
  }
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "helloAdmin",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Successfully Logout",
  });
};
