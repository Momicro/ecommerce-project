import { serve } from "inngest/next";
import {
  inngest,
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
} from "@/config/inngest";

export const runtime = "edge";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming: "allow",
  functions: [syncUserCreation, syncUserUpdation, syncUserDeletion],
});
