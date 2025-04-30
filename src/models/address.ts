import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  city: string;
  state: string;
  country: string;
}

const addressSchema = new Schema<IAddress>(
  {
    city: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
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
  }
);

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
