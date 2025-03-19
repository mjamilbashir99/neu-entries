import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    const email = session.customer_email;
    const billingCycle = session.mode === "subscription" ? session.subscription_details.interval : "Monthly";

    try {
      // Update your database (Example using Prisma)
      await User.findOneAndUpdate({ email }, { $set: { is_paid: 1, plan_name: billingCycle === "year" ? "Yearly" : "Monthly" } });

      console.log(`Subscription updated for ${email}`);
    } catch (dbError) {
      console.error("Database update failed:", dbError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
