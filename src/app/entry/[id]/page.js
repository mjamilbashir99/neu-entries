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

  // Working fine but not updating the entry name 
  // const handleGoDeeper = async () => {
  //   if (!message.trim() || !chat_id) return;

  //   const userMessage = { role: "user", content: message };

  //   try {
  //     // Save user message
  //     await fetch("/api/chats", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ user_id, chat_id, message, type: "sent" }),
  //     });

  //     // Get GPT response
  //     const res = await openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [...chat, userMessage],
  //     });

  //     const aiResponse = {
  //       role: "assistant",
  //       content: res.choices[0]?.message?.content || "No response from AI",
  //     };

  //     // Save GPT response
  //     await fetch("/api/chats", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_id,
  //         chat_id,
  //         message: aiResponse.content,
  //         type: "response",
  //       }),
  //     });

  //     // Update UI state
  //     setChat([...chat, userMessage, aiResponse]);
  //     setMessage(""); // Clear input
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };


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
  
      // If this is the first message, update the chat entry name
      if (chat.length === 0) {
        await fetch(`/api/updateEntryName`, {
          method: "PATCH", // Use PATCH for updates
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, entry_name: message }),
        });
      }
  
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


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Ensure we're sending form-data
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload");
  
      console.log("Uploaded Image Path:", data.imagePath);
  
      // Save image path to the chat and show the AI response
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id, 
          chat_id, 
          message: data.imagePath, 
          type: "sent" 
        }),
      });
  
      // Hardcoded AI response
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id, 
          chat_id, 
          message: "I have seen the image. What is your question regarding this?", 
          type: "response" 
        }),
      });
  
      setChat([...chat, { role: "user", content: data.imagePath }, { role: "assistant", content: "I have seen the image. What is your question regarding this?" }]);
    } catch (error) {
      console.error("Error uploading image:", error);
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
          <div key={index} className={`mb-4 ${msg.role === "user" ? "text-left" : "text-blue-600 text-left"}`}>
            {/* Check if the message is an image path */}
            {msg.content.startsWith("/uploads/") ? (
              <img src={msg.content} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md" width="20%"/>
            ) : (
              <p className="text-lg">{msg.content}</p>
            )}
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
        <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="mt-4"
          />
        <FaMicrophone className="cursor-pointer" />
      </div>
    </div>
  );
};

export default EntryPage;
