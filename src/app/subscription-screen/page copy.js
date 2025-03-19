"use client"
import React, { useState } from "react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("Annual");
  const isAnnual = billingCycle === "Annual";

  return (
    <div className="flex flex-col items-center p-8 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-semibold">
        Upgrade to <span className="text-blue-600">Premium.</span>
      </h1>
      <p className="text-gray-600">Simple, transparent pricing. Cancel anytime.</p>

      <div className="mt-6 flex bg-gray-200 rounded-full p-1">
        <button
          className={`px-4 py-2 rounded-full ${isAnnual ? "bg-blue-600 text-white" : "text-black"}`}
          onClick={() => setBillingCycle("Annual")}
        >
          Annual
        </button>
        <button
          className={`px-4 py-2 rounded-full ${!isAnnual ? "bg-blue-600 text-white" : "text-black"}`}
          onClick={() => setBillingCycle("Monthly")}
        >
          Monthly
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Basic Plan */}
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Basic</h2>
          <p className="text-3xl font-bold">$0<span className="text-base font-normal">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>✅ 5 Go Deeper uses per entry</li>
            <li>✅ Unlimited entries</li>
            <li>✅ Upload images and media</li>
            <li>✅ Access to basic models</li>
          </ul>
          <p className="mt-4 text-blue-600 cursor-pointer">Your current plan</p>
        </div>

        {/* Premium Plan */}
        <div className="border p-6 rounded-lg shadow-md relative">
          {isAnnual && <span className="absolute top-2 right-2 bg-green-200 text-green-800 px-2 py-1 text-xs rounded-full">Save 20%</span>}
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="text-3xl font-bold">{isAnnual ? "$11.99" : "$14.99"}<span className="text-base font-normal">/month {isAnnual ? "billed annually" : ""}</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>✅ All basic features</li>
            <li>✅ Unlimited go deeper usage</li>
            <li>✅ Voice typing</li>
            <li>✅ Access to advanced models</li>
          </ul>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">Upgrade to Premium</button>
        </div>
      </div>
    </div>
  );
}