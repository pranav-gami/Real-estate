import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // the buyer
  propertyOwner: mongoose.Types.ObjectId; // the seller
  bookingDate: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
}

const bookingSchema = new Schema<IBooking>({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
},
{
  toJSON: {
    transform(_doc, ret) {
      delete ret.__v;
    },
  },
  toObject: {
    transform(_doc, ret) {
      delete ret.__v;
    },
  },
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
