import { NextResponse } from "next/server";
import Stripe from "stripe";
import Connection from "../../../app/dbconfig/dbconfig"; // Apni DB connection file import karein
import User from "../../../../model/UserModel"; // Apna user model import karein

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { connectToDatabase } from "@/lib/db"; // Your MongoDB connection file
// import User from "@/models/User"; // Your User model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("⚠️ No Stripe signature found!");
    return NextResponse.json({ error: "Webhook Error: No Signature" }, { status: 400 });
  }

  let event;
  let rawBody;

  try {
    // Read the raw request body
    rawBody = await req.text();

    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody, // Use raw text body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    try {
      await Connection();

      const user = await User.findOneAndUpdate(
        { stripeCustomerId: customerId },
        {
          $set: {
            paid_for_subscription: 1,
            subscriptionId: subscriptionId,
            subscriptionStatus: "active",
          },
        },
        { new: true }
      );

      if (!user) {
        console.error("⚠️ User not found for Stripe customer:", customerId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("✅ User subscription updated:", user);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ Database update error:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
