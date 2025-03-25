"use client";
import React from "react";
// import { useSession } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { CiShare1 } from "react-icons/ci";

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

  const handleExportEntries = async () => {
    try {
      const response = await fetch("/api/export-entries");
      if (!response.ok) throw new Error("Failed to export entries");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "entries.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export entries. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl p-6 rounded-lg">
        {/* Profile Picture */}
        <div className="">
          <div className="mt-20 flex flex-col ">
            <div className="w-16 h-16 overflow-hidden bg-orange-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
              <Image
                src={session?.user?.image}
                width={1000}
                height={1000}
                alt={session?.user?.name}
                className="w-full "
              />
            </div>
            <h2 className="text-2xl font-semibold mt-8">Personal details</h2>
          </div>

          {/* Personal Details */}
          <div className="mt-8">
            <p className="text-gray-600 font-bold">Name</p>
            <p className="text-gray-500 font-medium mt-2">
              {session?.user?.name || "Guest User"}
            </p>

            <p className="text-gray-600 font-semibold mt-8">Email address</p>
            <p className=" text-gray-500 font-medium mt-2">
              {session?.user?.email || "Not available"}
            </p>
          </div>
        </div>
        {/* Subscription Section */}
        <div className="pt-4 border-t-[1px] border-gray-300 mt-20">
          <h2 className="text-xl font-semibold">Your Subscription</h2>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-4 flex-wrap">
            <p className="sm:mt-0  mt-3">
              Manage your subscription or upgrade to premium.
            </p>
            <a
              href="/subscription-screen"
              className="text-blue-600 hover:underline flex items-center gap-2 sm:my-4 mt-3"
            >
              Upgrade to premium <CiShare1 />
            </a>
          </div>
        </div>

        {/* Help & Support */}
        <div className=" pt-4 mt-20">
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <div className="flex items-center justify-between mt-4 flex-wrap">
            <p className="text-gray-600 text-sm sm:mt-0  mt-3">
              We're here to help and would love to hear your feedback!
            </p>
            <a
              href="#"
              className="text-gray-500 flex gap-2 items-center m-0 justify-center sm:my-4  mt-3"
            >
              Contact support
              <CiShare1 />
            </a>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="mt-20 border-t-[1px] border-gray-300 pt-2">
          <h2 className="text-xl font-semibold">Data & Privacy</h2>

          <div className="mt-10">
            <p className="text-gray-600 font-semibold ">Legal</p>
            <div className="flex justify-between items-center  flex-wrap">
              <p className="text-gray-500 text-sm sm:mt-4  mt-3">
                View our terms of service and privacy policy
              </p>
              <a href="#" className="text-gray-500 flex gap-2 items-center">
                View legal <CiShare1 />
              </a>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-gray-600 font-semibold">Export your data</p>
            <div className="flex justify-between items-center flex-wrap">
              <p className="text-gray-500 text-sm sm:mt-0  mt-3">
                Download all your journal entries as a document
              </p>
              <a
                className="text-gray-500 cursor-pointer flex gap-2 sm:my-4  mt-3"
                onClick={handleExportEntries}
              >
                Export entries <CiShare1 />
              </a>
            </div>
          </div>
        </div>

        {/* Manage Account */}
        <div className="mt-20 border-t-[1px] border-gray-300 pt-4">
          <h2 className="text-xl font-semibold ">Manage account</h2>
          <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
            <p className="text-gray-500 text-sm sm:mt-4  mt-3">
              Permanently delete your account and data. For security purposes,
              you may be asked to sign in again with Google or email before
              deletion.
            </p>
            <a
              className="text-red-600 font-normal text-[17px] hover:bg-gray-100 cursor-pointer flex items-center mt-3 sm:mt-0"
              onClick={handleDeleteAccount}
            >
              Delete
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
