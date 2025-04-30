import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

//  MULTER STORAGE OBJECT FOR STORE IMAGE
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    let folder = "";
    if (req.originalUrl.includes("/user")) {
      folder = "users";
    } else if (req.originalUrl.includes("/property")) {
      folder = "properties";
    }
    cb(null, `public/assets/media/${folder}`);
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// FILE FILTER
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG,images are allowed!"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
