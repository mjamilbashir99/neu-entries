"use client";
import { useEffect, useState } from "react";
import { PiPlus } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";

export default function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(today);
    setCurrentDate(formattedDate);
  }, []);

  const handleNewEntry = () => {
    setEntries((prevEntries) => [
      ...prevEntries,
      { date: currentDate, text: "Empty entry..." },
    ]);
  };

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
    <div className="flex flex-col p-6 bg-[#faf9f5] h-screen pt-40">
      <div className="flex justify-between items-center mb-8 w-[55%] mx-auto">
        <h1 className="text-3xl text-gray-800 font-semibold">{currentDate}</h1>
        <div className="relative" onMouseLeave={() => setShowProfile(false)}>
          <div
            className="w-10 h-10 rounded-full overflow-hidden relative cursor-pointer"
            onMouseEnter={() => setShowProfile(true)}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User Image"}
                className="w-full h-full object-cover"
                width={1000}
                height={1000}
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          {showProfile && (
            <div className="absolute top-full w-60 bg-white left-3/6 -translate-x-3/6 shadow-lg shadow-gray-300 rounded-lg">
              <div className="flex justify-between items-center px-5 py-4 hover:bg-gray-100">
                <div className="cursor-pointer">
                  <p className="text-gray-700 font-normal text-[16px]">
                    {session?.user?.name}
                  </p>
                  <p className="text-gray-700 font-normal text-[16px] mt-1">
                    {session?.user?.email}
                  </p>
                </div>
                <MdChevronRight size={25} className="text-gray-500" />
              </div>
              <p className="text-blue-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer">
                Need Unlimited Depth Entries?
              </p>
              <p className="text-gray-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer">
                Get Help / Feedback
              </p>
              <p
                className="text-gray-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </p>
              <p
                className="text-red-600 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center w-[55%] mx-auto">
        <button
          onClick={handleNewEntry}
          className="w-full shadow-md shadow-gray-200 bg-white text-gray-400 py-5 px-6 rounded-xl text-xl hover:shadow-lg hover:translate-y-[-5px] duration-200 flex items-center justify-start gap-3"
        >
          <PiPlus />
          New Entry
        </button>

        <div className="text-gray-500 mx-auto mt-10 mb-4 flex gap-6 justify-end items-center">
          <IoSearchOutline size={25} />
          <CiFilter size={25} />
        </div>

        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md mb-4 hover:shadow-lg hover:translate-y-[-5px] duration-200"
            >
              <p className="text-gray-700 text-left">{entry.text}</p>
              <p className="text-gray-400 text-sm text-left mt-2">
                {entry.date}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-6">No entries found.</p>
        )}
      </div>
    </div>
  );
}
