"use client";
import React from "react";
// import { useSession } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";


const Profile = () => {
  const { data: session } = useSession(); // Correctly using useSession


  const handleDeleteAccount = async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (confirmDelete) {
        try {
          const response = await fetch("/api/delete-account", {
            method: "DELETE",
          });
  
          if (response.ok) {
            alert("Your account has been deleted.");
            signOut({ callbackUrl: "/login" }); // Sign out after account deletion
          } else {
            alert("Failed to delete account. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting account:", error);
          alert("An error occurred. Please try again later.");
        }
      }
    };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {session?.user?.name?.charAt(0).toUpperCase() || "T"}
          </div>
          <h2 className="text-2xl font-semibold mt-2">Personal details</h2>
        </div>

        {/* Personal Details */}
        <div className="mt-4">
          <p className="text-gray-600 font-semibold">Name</p>
          <p className="text-gray-800">{session?.user?.name || "Guest User"}</p>

          <p className="text-gray-600 font-semibold mt-3">Email address</p>
          <p className="text-gray-800">{session?.user?.email || "Not available"}</p>
        </div>

        {/* Subscription Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Your Subscription</h2>
          <p className="text-gray-600 text-sm">
            Manage your subscription or upgrade to premium.
          </p>
          <a href="/subscription-screen" className="text-blue-600 hover:underline mt-2 inline-block">
            Upgrade to premium
          </a>
        </div>

        {/* Help & Support */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <p className="text-gray-600 text-sm">
            We're here to help and would love to hear your feedback!
          </p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">
            Contact support
          </a>
        </div>

        {/* Data & Privacy */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Data & Privacy</h2>

          <div className="mt-3">
            <p className="text-gray-600 font-semibold">Legal</p>
            <p className="text-gray-600 text-sm">
              View our terms of service and privacy policy
            </p>
            <a href="#" className="text-blue-600 hover:underline mt-1 inline-block">
              View legal
            </a>
          </div>

          <div className="mt-4">
            <p className="text-gray-600 font-semibold">Export your data</p>
            <p className="text-gray-600 text-sm">
              Download all your journal entries as a document
            </p>
            <a href="#" className="text-blue-600 hover:underline mt-1 inline-block">
              Export entries
            </a>
          </div>
        </div>

        {/* Manage Account */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-red-600">Manage account</h2>
          <p className="text-gray-600 text-sm">
            Permanently delete your account and data.
          </p>
          <p className="text-gray-500 text-xs italic">
            For security purposes, you may be asked to sign in again with Google or email before deletion.
          </p>
          <a
                className="text-red-600 font-normal text-[17px] hover:bg-gray-100 cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
