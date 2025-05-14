import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  size: string;
  bedrooms?: number;
  parking?: number;
  propertyType: "Apartment" | "House" | "Villa" | "Plot";
  status: "Sale" | "Rent" | "Sold" | "Rented";
  images: string[];
  ownerId: Types.ObjectId;
  addressId: Types.ObjectId;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String },
  size: { type: String, required: true },
  bedrooms: { type: Number },
  parking: { type: Number },
  propertyType: {
    type: String,
    enum: ["Apartment", "House", "Villa", "Plot"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Sale", "Rent", "Sold", "Rented"],
    required: true,
  },
  images: [{ type: String }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

const Property = mongoose.model<IProperty>("Property", propertySchema);
export default Property;
