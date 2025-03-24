import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET() {
  try {
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
