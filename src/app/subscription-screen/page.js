"use client"
import { useEffect, useState } from "react";
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
   <div className="flex flex-col items-center p-8 bg-white text-black min-h-screen">
      <h4 className="text-4xl font-semibold text-center">
        Upgrade to <span className="text-blue-600">Premium.</span>
      </h4>
      <p className="text-gray-600 text-lg mt-2">Simple, transparent pricing. Cancel anytime.</p>

      {/* Toggle Switch */}
      <div className="mt-6 flex bg-gray-200 rounded-full p-1 w-64 justify-between">
        <button
          className={`px-6 py-2 rounded-full w-1/2 text-center ${
            isAnnual ? "bg-white text-black" : "bg-blue-600 text-white"
          }`}
          onClick={() => setBillingCycle("Monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-6 py-2 rounded-full w-1/2 text-center ${
            isAnnual ? "bg-blue-600 text-white" : "bg-white text-black"
          }`}
          onClick={() => setBillingCycle("Annual")}
        >
          Annual
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="p-10 rounded-lg shadow-xl shadow-gray-300 flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold">Basic</h2>
          <p className="text-3xl font-bold mt-2">
            $0 <span className="text-base font-normal">/month</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 text-center">
            <li>✅ 5 Go Deeper uses per entry</li>
            <li>✅ Unlimited entries</li>
            <li>✅ Upload images and media</li>
            <li>✅ Access to basic models</li>
          </ul>
          <p className="mt-10 text-blue-600 underline cursor-pointer">Your current plan</p>
        </div>

        <div className="p-10 rounded-lg shadow-xl shadow-gray-300 flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="text-3xl font-bold mt-2">
            {isAnnual ? "$11.99" : "$14.99"}
            <span className="text-base font-normal"> /month {isAnnual ? "billed annually" : ""}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 text-center">
            <li>✅ All basic features</li>
            <li>✅ Unlimited go deeper usage</li>
            <li>✅ Voice typing</li>
            <li>✅ Access to advanced models</li>
          </ul>
          <button
            className="mt-6 w-4/5 bg-blue-600 text-white py-3 rounded-full text-lg font-semibold"
            onClick={handleCheckout}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
