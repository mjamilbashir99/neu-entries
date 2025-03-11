"use client";
import { useEffect, useState } from "react";
import { PiPlus } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";

export default function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [entries, setEntries] = useState([]);
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
    // Add a new entry section with the current date
    setEntries([...entries, { date: currentDate, text: "Empty entry..." }]);
  };
  return (
    <div className="flex flex-col p-6 bg-[#faf9f5] h-screen pt-40">
      <div className="flex justify-between items-center mb-8 w-[55%] mx-auto ">
        <h1 className="text-3xl text-gray-800 font-semibold">{currentDate}</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="https://via.placeholder.com/40"
            alt="User Icon"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-center w-[55%] mx-auto ">
        <button
          onClick={handleNewEntry} // Fix here: don't invoke the function
          className="w-full shadow-md shadow-gray-200 bg-white text-gray-400 py-5 px-6 rounded-xl text-xl hover:shadow-lg hover:translate-y-[-5px] duration-200 flex items-center justify-items-start gap-3"
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
// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [currentDate, setCurrentDate] = useState("");
//   const [entries, setEntries] = useState([]);

//   // Get the current date when the component is mounted
//   useState(() => {
//     const today = new Date();
//     const formattedDate = new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(today);
//     setCurrentDate(formattedDate);
//   }, []);

//   const handleNewEntry = () => {
//     // Add a new entry section with the current date
//     setEntries([...entries, { date: currentDate, text: "Empty entry..." }]);
//   };

//   return (
//     <div className="flex flex-col p-6 bg-gray-50">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl text-gray-800 font-semibold">{currentDate}</h1>
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             src="https://via.placeholder.com/40"
//             alt="User Icon"
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       <div className="text-center">
//         <button
//           onClick={handleNewEntry}
//           className="bg-black text-white py-2 px-6 rounded-lg text-lg hover:bg-gray-700"
//         >
//           + New Entry
//         </button>
//         {/* Map through entries and render each one */}
//         <div className="mt-6 space-y-4">
//           {entries.map((entry, index) => (
//             <div key={index} className="bg-white p-4 rounded-lg shadow-md">
//               <p className="text-gray-700">{entry.text}</p>
//               <p className="text-gray-500 text-sm">{entry.date}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
