import { Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

// CREATE-USER SERVICE
export const createUser = async (req: Request) => {
  try {
    const { name, email, password, role, city, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists..");
    }
    let imagePath: string | undefined;
    if (req.file) {
      imagePath = req.file.filename;
    } else {
      throw new Error("Image Required..");
    }
    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 5),
      role,
      city,
      phone,
      image: imagePath,
    });
    await newUser.save();
    const user = { id: newUser._id, name: newUser.name, email: newUser.email };
    return user;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured..");
    }
  }
};

//USER-DATA SERVICE
export const getUserData = async (req: Request, all: Boolean) => {
  try {
    let userData;
    if (all) {
      userData = await User.find({});
      if (!userData) {
        throw new Error("User model is Empty..");
      }
    } else {
      const userId = req.params.id;
      userData = await User.findById(userId);
      if (!userData) {
        throw new Error("User doesn't Exists..");
      }
    }
    return userData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured..");
    }
  }
};

// UPDATE-USER SERVICE
export const updateUserData = async (req: Request) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User not found..");
    }
    const { name, email, password, role, city, phone } = req.body;
    let imagepath: string | undefined;
    if (req.file) {
      imagepath = req.file.filename;
    }
    const response = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          email,
          password: await bcrypt.hash(password, 5),
          role,
          city,
          phone,
          image: imagepath,
        },
      },
      {
        new: true,
      }
    );
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while updating user..");
    }
  }
};

// DELETE USER SERVICE

export const deleteUser = async (req: Request) => {
  try {
    const userId = req.params.id;
    if (!(await User.findById(userId))) {
      throw new Error("User not found..");
    }
    const response = await User.findByIdAndDelete(userId);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while updating user..");
    }
  }
};
