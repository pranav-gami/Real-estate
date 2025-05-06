import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";

//AUTHENTICATING USER AND TOKEN
// LOGIN ADMIN

// export const loginAdmin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error("User not Found");
//     }
//     const isPassMatch = await bcrypt.compare(password, user.password);
//     if (!isPassMatch) {
//       throw new Error("Password don't Match!");
//     }
//     const token = jsonwebtoken.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "helloAdmin",
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.status(200).json({ success: true, user, token });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// LOGIN USER

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not Found!");
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      throw new Error("Password don't Match!");
    }
    const token = jsonwebtoken.sign(
      {
        user,
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
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
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Already Logout!");
    }
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "helloAdmin",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Successfully Logout",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
