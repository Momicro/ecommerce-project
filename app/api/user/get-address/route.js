import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    const addressesData = await Address.find({ userId });
    if (!addressesData) {
      return NextResponse.json({
        success: false,
        message: "Addresses not found",
      });
    }
    const addresses = addressesData;
    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
