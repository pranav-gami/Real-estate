import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // BUYER
  propertyOwner: mongoose.Types.ObjectId; // SELLER OR OWNER
  message: string;
  status: "PENDING" | "RESPONDED";
}

const inquirySchema = new Schema<IInquiry>(
  {
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
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "RESPONDED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
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
  }
);

const Inquiry = mongoose.model<IInquiry>("Inquiry", inquirySchema);
export default Inquiry;
