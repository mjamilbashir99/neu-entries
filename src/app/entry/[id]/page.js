"use client"
import { useState } from "react";
import { FaMicrophone, FaImage } from "react-icons/fa";

const EntryPage = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      {/* Date */}
      <p className="text-gray-500 mb-4">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      {/* Input Field */}
      <input
        type="text"
        placeholder="What's on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-96 border-b-2 border-gray-300 outline-none text-lg p-2 mb-6 text-center"
      />

      {/* Button */}
      <button className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-700 transition duration-200">
        Go Deeper <span className="text-gray-300 text-sm">(⌘ + ↵)</span>
      </button>

      {/* Icons */}
      <div className="flex gap-4 mt-4 text-gray-500 text-lg">
        <FaImage className="cursor-pointer" />
        <FaMicrophone className="cursor-pointer" />
      </div>
    </div>
  );
};

export default EntryPage;
