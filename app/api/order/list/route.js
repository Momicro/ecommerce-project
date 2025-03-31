import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();
    const orders = await Order.find({ userId }).populate(
      "address items.product"
    );
    if (!orders) {
      return NextResponse.json({ success: false, message: "Orders not found" });
    }
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
