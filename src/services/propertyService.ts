import { Request } from "express";
import Property from "../models/property.model";
import Address from "../models/propertyAddress.model";
import User from "../models/user.model";

// CREATE PROPERTY SERVICE

export const createProperty = async (req: Request) => {
  try {
    const {
      title,
      description,
      price,
      location,
      size,
      bedrooms,
      parking,
      propertyType,
      status,
      ownerId,
      addressId,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const images = files.map((file) => file.filename);
    if (images.length < 2) {
      throw new Error("Atleast two images required..");
    }

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !size ||
      !propertyType ||
      !status ||
      !ownerId ||
      !addressId
    ) {
      throw new Error("Missing required fields..");
    }

    //Validate referenced ID's existance
    const addressExists = await Address.findById(addressId);
    if (!addressExists) {
      throw new Error("Address not found.");
    }

    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      throw new Error("Owner not found.");
    }

    const newPropertyData: any = {
      title,
      description,
      price,
      location,
      size,
      propertyType,
      status,
      images,
      ownerId,
      addressId,
    };

    if (propertyType !== "Plot") {
      newPropertyData.bedrooms = parseInt(bedrooms);
      newPropertyData.parking = parseInt(parking);
    }
    const newProperty = await Property.create(newPropertyData);
    return newProperty;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

//PROPERTY-DATA SERVICE

export const getPropertyData = async (req: Request, all: Boolean) => {
  try {
    if (all) {
      const propertyData = await Property.find({}).populate(
        "addressId",
        "city district state country"
      );
      if (propertyData.length == 0) {
        throw new Error("Property model is Empty..");
      }
      return propertyData;
    }
    const propertyId = req.params.id;
    const propertyData = await Property.findById(propertyId)
      .populate("ownerID", "name phone")
      .populate("addressId", "city district state country");
    if (!propertyData) {
      throw new Error("Property not Found !");
    }
    return propertyData;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// UPDATE-PROPERTY SERVICE

export const updatePropertyData = async (req: Request) => {
  try {
    const propertyId = req.params.id;
    const isExists = await Property.findById(propertyId);
    if (!isExists) {
      throw new Error("Property you are trying to update is not found !");
    }
    const {
      title,
      description,
      price,
      location,
      size,
      bedrooms,
      parking,
      propertyType,
      status,
      ownerId,
      addressId,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !size ||
      !propertyType ||
      !status ||
      !ownerId ||
      !addressId
    ) {
      throw new Error("Missing required fields..");
    }

    const files = req.files as Express.Multer.File[];
    const images = files.map((file) => file.filename);
    if (images.length < 2) {
      throw new Error("Atleast two images required..");
    }

    //Validate referenced ID's existance
    const addressExists = await Address.findById(addressId);
    if (!addressExists) {
      throw new Error("Address not found.");
    }

    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      throw new Error("Owner not found.");
    }

    const updatePropertyData: any = {
      title,
      description,
      price,
      location,
      size,
      propertyType,
      status,
      images,
      ownerId,
      addressId,
    };

    if (propertyType !== "Plot") {
      updatePropertyData.bedrooms = bedrooms;
      updatePropertyData.parking = parking;
    }
    const response = await Property.findByIdAndUpdate(
      propertyId,
      {
        $set: updatePropertyData,
      },
      { new: true }
    );
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured in Updating Property..");
    }
  }
};

// DELETE PROPERTY SERVICE

export const deletePropertyById = async (req: Request) => {
  try {
    const propertyId = req.params.id;
    if (!(await Property.findById(propertyId))) {
      throw new Error("Property not found..");
    }
    const response = await Property.findByIdAndDelete(propertyId);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred while Deleting Property..");
    }
  }
};
