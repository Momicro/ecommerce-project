// actually we want to update the property item:{} for the user with the id picked from the url
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const cartData = await request.json();

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
