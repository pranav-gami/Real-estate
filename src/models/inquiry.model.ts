import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // BUYER
  message: string;
  status: "PENDING" | "RESPONDED";
}

const inquirySchema = new Schema<IInquiry>({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true }, //Is this availabe ?  or Is price Nagociable etc?
  status: {
    type: String,
    enum: ["PENDING", "RESPONDED"],
    default: "PENDING",
  },
});

inquirySchema.index({ propertyId: 1, userId: 1 }, { unique: true });

const Inquiry = mongoose.model<IInquiry>("Inquiry", inquirySchema);
export default Inquiry;
