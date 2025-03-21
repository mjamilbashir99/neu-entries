"use client";
import { useEffect, useState, useRef } from "react";
import { PiPlus } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";

export default function Home() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = useSession();
  const [getEntries, setgetEntries] = useState([]);
  const [searchEntries, setsearchEntries] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const filterRef = useRef(null);
  const [filter, setfilter] = useState(false);

  useEffect(() => {
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(today);
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUserEntries");
        const data = await response.json();
        setgetEntries(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleNewEntry = async () => {
    const userId = session.user.id;

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries((prevEntries) => [...prevEntries, newEntry]); // Update UI
        router.push(`/entry/${newEntry._id}`);
      } else {
        console.error("Failed to create entry");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    }
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Set the search query in the state
  };

  // Filter entries based on the search query
  const filteredEntries = getEntries?.chats?.filter(
    (entry) =>
      entry.entry_name?.toLowerCase().includes(searchQuery.toLowerCase()) // Compare with the state query
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        searchEntries
      ) {
        setsearchEntries(false);
        setSearchQuery(""); // Search ko reset karega
      }

      if (
        filterRef.current &&
        !filterRef.current.contains(e.target) &&
        filter
      ) {
        setfilter(false); // Filter ko close karega
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchEntries, filter]);

  const [selectedOption, setSelectedOption] = useState("newestFirst"); // Default is "Newest First"

  const handleSelect = (option) => {
    setSelectedOption(option); // Update the selected option when clicked
  };

  return (
    <div className="flex flex-col p-6 bg-[#faf9f5] h-screen pt-20 overflow-hidden">
      <div className="flex justify-between items-center mb-8 w-[95%] md:w-[80%] lg:w-[45%] mx-auto">
        <h2 className="text-gray-800 font-medium w-full">{currentDate}</h2>
        <div className="relative" onMouseLeave={() => setShowProfile(false)}>
          <div
            className="w-5 h-5 rounded-full overflow-hidden relative cursor-pointer"
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
            <div className="absolute top-full w-60 bg-white left-3/6 -translate-x-3/6 shadow-lg shadow-gray-300 rounded-lg overflow-hidden z-50">
              <div className="flex justify-between items-center px-5 py-4 hover:bg-gray-100">
                <Link href="/profile">
                  <div className="cursor-pointer">
                    <p className="text-gray-700 font-normal text-[16px]">
                      {session?.user?.name}
                    </p>
                    <p className="text-gray-700 font-normal text-[16px] mt-1">
                      {session?.user?.email}
                    </p>
                  </div>
                </Link>
                <MdChevronRight size={25} className="text-gray-500" />
              </div>
              <Link href={"/subscription-screen"}>
                <p className="text-blue-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer">
                  Need Unlimited Depth Entries?
                </p>
              </Link>
              <p className="text-gray-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer">
                Get Help / Feedback
              </p>
              <p
                className="text-gray-700 font-normal text-[17px] px-5 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center w-[95%] md:w-[80%] lg:w-[45%] mx-auto">
        <button
          onClick={handleNewEntry}
          className="w-full shadow-md shadow-gray-200 bg-white text-gray-400 py-4 px-5 rounded-xl text-xl hover:shadow-lg hover:translate-y-[-5px] duration-200 flex items-center justify-start gap-3"
        >
          <PiPlus />
          New Entry
        </button>

        <div className="text-gray-500 mx-auto mt-10 mb-4 flex gap-6 justify-end items-center">
          <div className="relative" ref={searchRef}>
            <IoSearchOutline
              size={25}
              className="cursor-pointer hover:text-black"
              onClick={() => setsearchEntries(true)} // Always open the search on click
            />
            {searchEntries && (
              <div className="bg-white border border-gray-400 absolute w-44 -right-2 top-3/6 -translate-y-3/6 flex rounded-lg">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery} // Controlled input using state
                    onChange={handleSearch} // Update search query
                    placeholder="Search"
                    className="w-full h-8 border-none focus:ring-none focus:shadow-none focus:outline-none px-2"
                  />
                  <IoCloseOutline
                    size={20}
                    className="absolute top-3/6 -translate-y-3/6 right-1 cursor-pointer"
                    onClick={() => setsearchEntries(false)} // Close search field
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={filterRef}>
            <div>
              <CiFilter
                size={25}
                className="hover:text-black"
                onClick={() => setfilter(!filter)}
              />
            </div>
            {filter && (
              <div className="absolute top-full left-3/6 -translate-x-3/6 bg-white border border-gray-300 py-3 px-4 w-auto z-10">
                <div
                  className="flex gap-8  cursor-pointer"
                  onClick={() => handleSelect("newestFirst")}
                >
                  <p className="text-[16px] text-nowrap">Newest First</p>
                  {selectedOption === "newestFirst" && (
                    <IoMdCheckmark size={20} className="text-green-600" />
                  )}
                </div>
                <div
                  className="flex gap-8 mt-4 cursor-pointer"
                  onClick={() => handleSelect("oldestFirst")}
                >
                  <p className="text-[16px] text-nowrap">Oldest First</p>
                  {selectedOption === "oldestFirst" && (
                    <IoMdCheckmark size={20} className="text-green-600" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {session?.user?.id &&
          getEntries?.chats
            ?.filter((chat) => chat.user_id === session.user.id) // Filter by user_id
            .filter(
              (entry) =>
                entry.entry_name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) // Filter by searchQuery
            )
            .sort((a, b) => {
              if (selectedOption === "newestFirst") {
                return new Date(b.createdAt) - new Date(a.createdAt); // Newest first (descending)
              } else {
                return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first (ascending)
              }
            })
            .map((entry, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md mb-4 hover:shadow-lg hover:translate-y-[-5px] duration-200 cursor-pointer duration-300"
                onClick={() => router.push(`/entry/${entry._id}`)} // Make sure the URL is correct
              >
                <p className="text-gray-700 text-left">{entry.entry_name}</p>
                <p className="text-gray-400 text-sm text-left mt-2">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

        {getEntries?.chats?.length === 0 && (
          <p className="text-gray-500 mt-6">No entries found.</p>
        )}
      </div>
    </div>
  );
}
