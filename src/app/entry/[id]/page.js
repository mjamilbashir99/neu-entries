"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use next/navigation instead of next/router
import { FaMicrophone, FaImage } from "react-icons/fa";
import OpenAI from "openai";
import { useSession } from "next-auth/react";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const EntryPage = () => {
  const { id: chat_id } = useParams(); // Extract chat_id dynamically from URL
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const user_id = session?.user?.id;

  console.log("User ID:", user_id);
  console.log("Chat ID from URL:", chat_id);

  useEffect(() => {
    if (!chat_id) return; // Ensure chat_id is available before fetching data

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`/api/chats?chat_id=${chat_id}`);
        const data = await res.json();
        if (res.ok) {
          setChat(
            data.map((msg) => ({
              role: msg.type === "sent" ? "user" : "assistant",
              content: msg.message,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [chat_id]); // Refetch when chat_id changes

  const handleGoDeeper = async () => {
    if (!message.trim() || !chat_id) return;

    const userMessage = { role: "user", content: message };

    try {
      // Save user message
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, chat_id, message, type: "sent" }),
      });

      // Get GPT response
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...chat, userMessage],
      });

      const aiResponse = {
        role: "assistant",
        content: res.choices[0]?.message?.content || "No response from AI",
      };

      // Save GPT response
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          chat_id,
          message: aiResponse.content,
          type: "response",
        }),
      });

      // Update UI state
      setChat([...chat, userMessage, aiResponse]);
      setMessage(""); // Clear input
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      {/* Date */}
      <p className="text-gray-500 mb-4">
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Chat Messages */}
      <div className="w-full max-w-2xl p-4 rounded-lg overflow-y-auto max-h-96">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-left" : "text-blue-600 text-left"
            }`}
          >
            <p className="text-lg">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="What's on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full max-w-2xl border-b-2 border-gray-300 outline-none text-lg p-2 mt-4 text-center"
      />

      {/* Button */}
      <button
        onClick={handleGoDeeper}
        className="bg-gray-900 text-white px-6 py-3 mt-4 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-700 transition duration-200"
        disabled={!chat_id} // Disable button if chat_id is not available
      >
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
