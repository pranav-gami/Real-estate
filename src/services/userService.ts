import { Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

// CREATE-USER SERVICE
export const createUser = async (req: Request) => {
  try {
    const { name, email, password, role, city, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists..");
    }

    const userData: any = {
      name,
      email,
      password: await bcrypt.hash(password, 5),
    };

    if (req.file && req.file.filename) {
      userData.image = req.file.filename;
    }
    if (role) {
      userData.role = role;
    }
    if (city) {
      userData.city = city;
    }
    if (phone) {
      userData.phone = phone;
    }
    const newUser = new User(userData);
    await newUser.save();
    const user = { id: newUser._id, name: newUser.name, email: newUser.email };
    return user;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

//USER-DATA SERVICE
export const getUserData = async (req: Request, all: Boolean) => {
  try {
    let userData;
    if (all) {
      userData = await User.find({});
      if (userData.length == 0) {
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

    const userData: any = {
      name,
      email,
      password: await bcrypt.hash(password, 5),
    };

    if (req.file && req.file.filename) {
      userData.image = req.file.filename;
    }
    if (role) {
      userData.role = role;
    }
    if (city) {
      userData.city = city;
    }
    if (phone) {
      userData.phone = phone;
    }

    const response = await User.findByIdAndUpdate(
      userId,
      {
        $set: userData,
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

//UPDATE USER STATUS

export const updateUserStatus = async (req: Request) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User not found..");
    }
    const isActive = existingUser.isActive ? false : true;
    const response = await User.findByIdAndUpdate(
      userId,
      {
        $set: { isActive },
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
      throw new Error("Unknown error occurred while updating Status..");
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
