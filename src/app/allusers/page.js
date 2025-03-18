"use client";

import { useState, useEffect } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();

        // ✅ Ensure users is an array
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  console.log("Users Array:", users);

  return (
    <div className="p-6 w-full max-w-3xl mx-auto mt-10 shadow-md rounded-lg h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">All Users</h1>
      <h2 className="text-xl font-semibold mb-2 text-gray-700">User List:</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">S.No</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="border-b last:border-b-0">
                  <td className="py-3 px-6 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-6 text-gray-700">{user.name}</td>
                  <td className="py-3 px-6 text-gray-700">{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-6 text-center text-gray-600">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
