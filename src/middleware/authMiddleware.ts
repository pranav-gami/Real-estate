import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken = req.cookies?.token;
  const token = cookieToken;
  if (!token) {
    return res.redirect("/admin/login?error=login_required");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "User not found or token is invalid" });
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access !" });
  }
};
