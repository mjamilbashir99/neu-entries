import { NextResponse } from "next/server";
import Stripe from "stripe";
import Connection from "../../../app/dbconfig/dbconfig"; // Apni DB connection file import karein
import User from "../../../../model/EntriesModel"; // Apna user model import karein

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle checkout success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email; // Agar email use ho rahi ho
    const customerId = session.customer; // Stripe customer ID

    try {
      await Connection();

      // User ko email ya customerId se find kar ke update karein
      const user = await User.findOneAndUpdate(
        { stripeCustomerId: customerId }, // Email use karni ho to { email: customerEmail }
        { $set: { paid_for_subscription: 1 } },
        { new: true }
      );

      console.log("User subscription updated:", user);
    } catch (error) {
      console.error("Database update failed:", error);
      return NextResponse.json({ error: "Database update error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
