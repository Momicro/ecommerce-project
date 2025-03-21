import mongoose from "mongoose";

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
      required: false,
    },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false },
  { timestamps: true }
);

const user = mongoose.models.User || mongoose.model("User", userSchema);

export default user;
