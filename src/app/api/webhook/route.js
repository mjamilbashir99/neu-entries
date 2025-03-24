import { NextResponse } from "next/server";
import Stripe from "stripe";

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
    // Read the raw text body instead of JSON parsing
    rawBody = await req.text();

    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✔️ Payment Successful for:", session.customer_email);
  }

  return NextResponse.json({ received: true });
}
