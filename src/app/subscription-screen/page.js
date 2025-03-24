"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51R4GDaKB3BlrOdKGq7JNKqLohP3qrLpVRbEtSB2kn9jGnWENHxS28hDwz9hseX1YgytexaC0yZJeVzuoaN3arzIG00J9mF7hnS");

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("Annual");
  const isAnnual = billingCycle === "Annual";

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await res.json();
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 bg-white text-black min-h-screen" style={{ fontFamily: "var(--font-source-serif), Source Serif Pro, serif" }}>
      {/* Title */}
      <h4 className="text-4xl text-center">
        Upgrade to <span className="text-blue-600">Premium.</span>
      </h4>
      <p className="text-gray-500 text-lg mt-2">Simple, transparent pricing. Cancel anytime.</p>

      {/* Toggle Switch */}
      <div className="mt-6 flex items-center bg-gray-200 rounded-full p-1 w-64 relative">
        <div
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-blue-500 rounded-full transition-all duration-300 ${
            isAnnual ? "translate-x-full" : "translate-x-0"
          }`}
        ></div>

        <button
          className={`w-1/2 py-2 text-center rounded-full relative z-10 font-semibold transition-all ${
            isAnnual ? "text-black" : "text-white"
          }`}
          onClick={() => setBillingCycle("Monthly")}
        >
          Monthly
        </button>
        
        <button
          className={`w-1/2 py-2 text-center rounded-full relative z-10 font-semibold transition-all ${
            isAnnual ? "text-white" : "text-black"
          }`}
          onClick={() => setBillingCycle("Annual")}
        >
          Annual
        </button>
      </div>

      {/* Pricing Plans */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Basic Plan */}
        <div className="p-8 rounded-xl border border-gray-200 shadow-md flex flex-col w-full">
          <h2 className="text-2xl">Basic</h2>
          <p className="text-4xl font-bold mt-2">
            $0 <span className="text-base font-normal text-black-500">/month</span>
          </p>
          <ul className="mt-4 space-y-2 text-md text-black-600">
            <li>✓ 5 Go Deeper uses per entry</li>
            <li>✓ Unlimited entries</li>
            <li>✓ Upload images and media</li>
            <li>✓ Access to basic models</li>
          </ul>
          <p className="mt-12 underline text-md cursor-pointer text-center text-black">Your current plan</p>
        </div>

        {/* Premium Plan */}
        <div className="relative p-8 rounded-xl border border-gray-200 shadow-md flex flex-col w-full">
          {/* Discount Badge */}
          {isAnnual && (
            <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Save 20%
            </span>
          )}

          <h2 className="text-2xl">Premium</h2>
          <p className="text-4xl font-bold mt-2">
            {isAnnual ? "$11.99" : "$14.99"}
            <span className="text-base font-normal text-black-500"> /month {isAnnual ? "billed annually" : ""}</span>
          </p>
          <ul className="mt-4 space-y-2 text-md text-black-600">
            <li>✓ All basic features</li>
            <li>✓ Unlimited go deeper usage</li>
            <li>✓ Voice typing</li>
            <li>✓ Access to advanced models</li>
          </ul>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all"
            onClick={handleCheckout}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
