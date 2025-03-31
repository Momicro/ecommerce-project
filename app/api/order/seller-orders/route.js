import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();
    const orders = await Order.find({})
      .populate("address items.product")
      .sort({ userId: 1 });
    if (!orders) {
      return NextResponse.json({ success: false, message: "Orders not found" });
    }
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
