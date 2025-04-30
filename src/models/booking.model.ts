import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // the buyer
  ownerId: mongoose.Types.ObjectId; // the seller
  bookingDate: Date;
  status: "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
}

const bookingSchema = new Schema<IBooking>({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingDate: { type: Date, default: Date.now(), required: true },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED"],
    default: "CONFIRMED",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
