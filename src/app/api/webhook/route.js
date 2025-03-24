import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // ⛔️ Prevent Next.js from parsing req.body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // ✅ Read the raw body as a buffer
    const rawBody = await buffer(req);
    
    // ✅ Convert buffer to string
    event = stripe.webhooks.constructEvent(rawBody.toString(), sig, endpointSecret);
    
    console.log("✅ Webhook signature verified!");
    console.log("🔹 Event Type:", event.type);

    // 🔄 Handle event
    if (event.type === 'checkout.session.completed') {
      console.log("🎉 Checkout session completed!");
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }
}
