// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const cookieToken = req.cookies?.token;
//   const token = cookieToken;
//   if (!token) {
//     return res.redirect("/admin/login?error=login_required");
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ success: false, message: "Invalid Token!!" });
//   }
// };
