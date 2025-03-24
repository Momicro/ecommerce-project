import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
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
    const products = await Product.find({}).sort({ Date: -1 });

    return NextResponse.json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
