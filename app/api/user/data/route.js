// here we want to fetch the user data from the database and return it to the client
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
//import toast from "react-hot-toast";

export async function GET(request) {
  try {
    // Check if the user is authenticated
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();
    console.log("Connected to database");

    // Fetch user data from the database
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    //toast.error("Error connecting to database");

    return NextResponse.json({ success: false, message: error.message });
  }
}
