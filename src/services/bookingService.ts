import { Request } from "express";
import Booking from "../models/booking.model";
import Property from "../models/property.model";
import User from "../models/user.model";

// ADD-BOOKING SERVICE

export const createBooking = async (req: Request) => {
  try {
    const { propertyId, userId } = req.body;

    const data = await Property.findById(propertyId);
    // CONDITIONS AND VALIDATIONS
    const existingBooking = await Booking.findOne({
      //Already booked?
      propertyId: propertyId,
      status: "CONFIRMED",
    });
    if (existingBooking) {
      throw new Error("This property is already booked.");
    }
    if (userId == data?.ownerId) {
      //Checks for User and Owner Won't be same.
      throw new Error("Buyer and Seller can't be Same");
    }
    const userExists = await User.findById(userId); //User exists??
    if (!userExists) {
      throw new Error("User not found.");
    }
    const propertyExists = await Property.findById(propertyId); //Property exists??
    if (!propertyExists) {
      throw new Error("Property not found.");
    }

    const booking = await Booking.create({
      propertyId,
      userId,
    });
    return booking;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

//BOOKING-DATA SERVICE

export const getBookingData = async (req: Request, all: Boolean) => {
  try {
    if (all) {
      const bookingData = await Booking.find({});
      if (bookingData.length == 0) {
        throw new Error("No Bookings Found !");
      }
      return bookingData;
    }
    const bookingId = req.params.id;
    const bookingData = await Booking.findById(bookingId);
    if (!bookingData) {
      throw new Error("Booking details not Found !");
    }
    return bookingData;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occured..");
    }
  }
};

// UPDATE-BOOKING SERVICE

export const updateBookingData = async (req: Request) => {
  try {
    const bookingId = req.params.id;
    const isExists = await Booking.findById(bookingId);
    if (!isExists) {
      throw new Error(
        "Booking details you are trying to update is not found !"
      );
    }

    const { propertyId, userId } = req.body;
    const data = await Property.findById(propertyId);
    // CONDITIONS AND VALIDATIONS CHECK
    if (userId == data?.ownerId) {
      throw new Error("Buyer and Seller Can't be Same!");
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found !");
    }
    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      throw new Error("Property not found !");
    }

    const response = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { propertyId, userId },
      },
      { new: true }
    );
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

//UPDATE STATUS SERVICES

export const updateStatus = async (req: Request) => {
  try {
    const bookingId = req.params.id;
    const isExists = await Booking.findById(bookingId);
    if (!isExists) {
      throw new Error("Booking you are trying to update is not found !");
    }
    const { status, paymentStatus } = req.body;
    const response = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { status, paymentStatus },
      },
      { new: true }
    );
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// DELETE-BOOKING SERVICE

export const deleteBooking = async (req: Request) => {
  try {
    const bookingId = req.params.id;
    if (!(await Booking.findById(bookingId))) {
      throw new Error("Booking details not found..");
    }
    const response = await Booking.findByIdAndDelete(bookingId);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
