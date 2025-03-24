// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import Connection from "../../../app/dbconfig/dbconfig"; // Apni DB connection file import karein
// import User from "../../../../model/UserModel"; // Apna user model import karein

import { NextResponse } from "next/server";
import Stripe from "stripe";
import Connection from "../../../app/dbconfig/dbconfig";
import User from "../../../../model/UserModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-03-14" });

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email; // Assuming email is used to identify users

    try {
      await Connection();
      const user = await User.findOneAndUpdate(
        { email: customerEmail },
        { $set: { paid_for_subscription: 1 } },
        { new: true }
      );

      if (user) {
        console.log(`User ${customerEmail} upgraded to premium.`);
      } else {
        console.warn(`No user found with email ${customerEmail}`);
      }
    } catch (error) {
      console.error("Database update failed:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
