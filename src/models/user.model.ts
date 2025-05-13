import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  image?: String;
  role: "USER" | "ADMIN" | "AGENT";
  isActive?: Boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  city: { type: String },
  image: { type: String },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "AGENT"],
    default: "USER",
  },
  isActive: { type: Boolean, default: false },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
