// import prisma from "../utils/prisma";
// import jsonwebtoken from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { Request, Response } from "express";

// //AUTHENTICATING USER AND TOKEN
// export const loginAdmin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await prisma.user.findUnique({ where: { email: email } });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Admin not Found!" });
//     }
//     const isPassMatch = await bcrypt.compare(password, user.password);
//     if (!isPassMatch) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Password do not match!!" });
//     }
//     if (user.role != "ADMIN") {
//       return res
//         .status(401)
//         .json({ success: false, message: "Only Admin can Login here" });
//     }
//     const token = jsonwebtoken.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "helloAdmin",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ success: true, user, token });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(400).json({ success: false, message: error.message });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "An unknown error occurred" });
//     }
//   }
// };

// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await prisma.user.findUnique({ where: { email: email } });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not Found!" });
//     }
//     const isPassMatch = await bcrypt.compare(password, user.password);
//     if (!isPassMatch) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Password do not match!!" });
//     }
//     if (user.role != "USER") {
//       return res
//         .status(401)
//         .json({ success: false, message: "Only User can Login here" });
//     }
//     const token = jsonwebtoken.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "helloAdmin",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ success: true, user, token });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(400).json({ success: false, message: error.message });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "An unknown error occurred" });
//     }
//   }
// };

// //Logout-CONTROLLER
// export const logoutUser = async (req: Request, res: Response) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(200).json({
//       success: true,
//       message: "User already logged out.",
//     });
//   }
//   // Clear the cookie
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "helloAdmin",
//     sameSite: "lax",
//     path: "/",
//   });
//   return res.status(200).json({
//     success: true,
//     message: "User logged out and cookie cleared.",
//   });
// };
