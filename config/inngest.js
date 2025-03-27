import { Inngest } from "inngest";
import User from "@/models/User"; // Import the User model
import dbConnect from "./db";
import { use } from "react";
import Order from "@/models/order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickstart-next" });

// Inngest function to save a new user to the database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await dbConnect();
    await User.create(userData);
  }
);

// Inngest function to update a user in the database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to delete a user from the database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);

// create inngest function to create user's order in the mongodatabase
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: { maxSize: 5, timeout: "5s" },
  },
  { event: "clerk/order.created" },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.user_id,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      };
    });
    await dbConnect();
    await Order.insertMany(orders);
    return { success: true, processed: events.length };
  }
);
