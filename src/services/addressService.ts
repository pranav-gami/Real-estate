import { Request } from "express";
import Address from "../models/address";

// ADD NEW ADDRESS SERVICE

export const insertAddress = async (req: Request) => {
  try {
    const { city, state, country } = req.body;
    const isExists = await Address.findOne({ city });
    if (isExists) {
      throw new Error("Address already Exists!!");
    }
    const newAddress = new Address({
      city,
      state,
      country,
    });
    const addr = await newAddress.save();
    return addr;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured!!");
    }
  }
};

//ADDRESS-DATA SERVICE

export const getAddressData = async (req: Request, all: Boolean) => {
  try {
    if (all) {
      const addressData = await Address.find({});
      if (!addressData) {
        throw new Error("Address model is Empty!");
      }
      return addressData;
    }
    const addrId = req.params.id;
    const addressData = await Address.findById(addrId);
    if (!addressData) {
      throw new Error("Address doesn't Exits!");
    }
    return addressData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured!!");
    }
  }
};

// UPDATE-ADDRESS SERVICE

export const updateAddressData = async (req: Request) => {
  try {
    const addrId = req.params.id;
    const isExists = await Address.findById(addrId);
    if (!isExists) {
      throw new Error("Address you are trying to update is not found!");
    }
    const { city, state, country } = req.body;
    const address = await Address.findByIdAndUpdate(
      addrId,
      {
        $set: {
          city,
          state,
          country,
        },
      },
      {
        new: true,
      }
    );
    return address;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while updating Address.");
    }
  }
};

// DELETE ADDRESS SERVICE

export const deleteAddress = async (req: Request) => {
  try {
    const addrId = req.params.id;
    if (!(await Address.findById(addrId))) {
      throw new Error("Address not found !");
    }
    const address = await Address.findByIdAndDelete(addrId);
    return address;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while updating Address.");
    }
  }
};
