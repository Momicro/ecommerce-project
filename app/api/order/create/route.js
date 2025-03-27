import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";

// we need to create a new order and add it to the database
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // calculate amount from items using reduce
    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: "Product not found",
        });
      }
      return acc + product.offerPrice * item.quantity;
    }, 0);

    await inngest.send({
      name: "clerk/order.created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.17),
        date: Date.now(),
      },
    }); // send event to inngest

    // Clear the user cart
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    user.cartItems = {};
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order placed",
      data: await Order.create({
        userId,
        items,
        amount,
        address,
      }),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
