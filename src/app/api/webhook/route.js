

import { NextResponse } from "next/server";
import Stripe from "stripe";
import Connection from "../../../app/dbconfig/dbconfig";
import User from "../../../../model/UserModel";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-03-14" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await buffer(req.body);

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signaturexxxx verifixcation failed.", err.message);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    try {
      await Connection();
      const user = await User.findOneAndUpdate(
        { email: customerEmail },
        { $set: { paid_for_subscription: true } },
        { new: true }
      );

      if (user) {
        console.log(`✅ User ${customerEmail} upgraded to premium.`);
      } else {
        console.warn(`⚠️ No user found with email ${customerEmail}`);
      }
    } catch (error) {
      console.error("❌ Database update failed:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
