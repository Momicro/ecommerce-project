import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false },
  { timestamps: true }
);

const user = mongoose.models.user || mongoose.model("User", userSchema);

export default user;
