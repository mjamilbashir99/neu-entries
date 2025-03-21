import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { billingCycle } = body;

    if (!billingCycle) {
      throw new Error("Billing cycle is missing.");
    }

    const interval = billingCycle === "Annual" ? "year" : "month";
    const unitAmount = billingCycle === "Annual" ? 1199 * 12 : 1499;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Premium Plan (${billingCycle})` },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        "https://neu-entries-git-main-mjamilbashir99s-projects.vercel.app/success",
      cancel_url:
        "https://neu-entries-git-main-mjamilbashir99s-projects.vercel.app/cancel",
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
