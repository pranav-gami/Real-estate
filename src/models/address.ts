import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  city: string;
  state: string;
  country: string;
}

const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
