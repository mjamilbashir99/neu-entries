"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FaMicrophone, FaImage } from "react-icons/fa";
import OpenAI from "openai";
import { useSession } from "next-auth/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const EntryPage = () => {
  const fileInputRef = useRef(null);
  const { id: chat_id } = useParams();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceTimer = useRef(null);

  const [isFirstMessage, setIsFirstMessage] = useState(false);

  const user_id = session?.user?.id;

  useEffect(() => {
    if (!chat_id) return;

    // Load message specific to this chat_id from localStorage
    const savedMessage = localStorage.getItem(`message_${chat_id}`);
    if (savedMessage) {
      setMessage(savedMessage);
    }

    // Check if chat has history
    const checkChatHistory = async () => {
      try {
        const res = await fetch(`/api/chats?chat_id=${chat_id}`);
        const data = await res.json();
        if (res.ok && data.length === 0) {
          setIsFirstMessage(true); // No chat history, it's the first message
        }
      } catch (error) {
        console.error("Error checking chat history:", error);
      }
    };

    checkChatHistory();
  }, [chat_id]);

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Store message specific to this chat_id
    localStorage.setItem(`message_${chat_id}`, newMessage);

    // If it's the first message and chat has no history, update entry name (debounced)
    if (isFirstMessage && newMessage.trim().length > 0) {
      clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        try {
          await fetch(`/api/updateEntryName`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id, entry_name: newMessage }),
          });

          setIsFirstMessage(false); // Prevent multiple updates
        } catch (error) {
          console.error("Error updating entry name:", error);
        }
      }, 1000); // Delay API call by 1000ms
    }
  };


  useEffect(() => {
    if (!chat_id) return;

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
  }, [chat_id]);

  const fetchResponseCount = async () => {
    const res = await fetch(`/api/chats/count?chat_id=${chat_id}`);
    const data = await res.json();
    console.log("Response Count:", data.count);
  };

  const handleGoDeeper = async () => {
    if (!message.trim() && !uploadedImagePath) return;
    if (!chat_id) return;

    setLoading(true); // Set loading to true

    const res = await fetch(`/api/chats/count?chat_id=${chat_id}`);
    const { count } = await res.json();

    if (count >= 5) {
      router.push("/subscription-screen");
      return;
    }

    const systemPrompt = {
      role: "system",
      content: `You are a Journaling Assistant designed to help users explore their thoughts and emotions through reflective prompts. 
    Your goal is to encourage deeper self-exploration while maintaining a supportive, non-judgmental tone. 

    Response Guidelines:
    1. Keep responses concise—prompt further reflection instead of providing long explanations.
    2. Ask open-ended questions to encourage users to expand on their thoughts.
    3. Adapt to the depth of the user’s entry:
       - For brief responses, start with "What" questions to gather more context.
       - For detailed or emotional responses, use "How" or "Why" questions to encourage deeper reflection.
    4. Maintain a calm and non-judgmental tone, ensuring users feel safe expressing themselves.
    5. If an image is provided, acknowledge it and, when appropriate, ask how it relates to their thoughts or emotions.`,
    };

    const userMessages = [];
    if (uploadedImagePath) {
      userMessages.push({ role: "user", content: uploadedImagePath });
    }
    if (message.trim()) {
      userMessages.push({ role: "user", content: message });
    }

    try {
      for (const msg of userMessages) {
        await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            chat_id,
            message: msg.content,
            type: "sent",
          }),
        });
      }

      if (chat.length === 0) {
        await fetch(`/api/updateEntryName`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, entry_name: message }),
        });
      }

      const res = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [systemPrompt, ...chat, ...userMessages],
        temperature: 0.1,
        max_tokens: 100,
      });

      const aiResponse = {
        role: "assistant",
        content: res.choices[0]?.message?.content || "No response from AI",
      };

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

      setChat([...chat, ...userMessages, aiResponse]);
      setMessage("");
      setImagePreview(null);
      setUploadedImagePath(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the response is received
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
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload");

      console.log("Uploaded Image Path:", data.imagePath);
      setUploadedImagePath(data.imagePath);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain");

    if (draggedIndex !== dropIndex) {
      const newChat = [...chat];
      const draggedItem = newChat.splice(draggedIndex, 1)[0]; // Remove dragged item
      newChat.splice(dropIndex, 0, draggedItem); // Insert it at the new position
      setChat(newChat);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen bg-white text-gray-800 px-4">
      <Link href={"/journal"}>
        <IoIosArrowRoundBack className="absolute left-4 top-4 text-gray-400 text-2xl" />
      </Link>

      <p className="text-gray-500 mb-4">
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="w-full max-w-2xl p-4 rounded-lg overflow-y-auto max-h-96">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-left" : "text-blue-600 text-left"
            }`}
            draggable={msg.content.startsWith("/uploads/")} // Enable dragging only for images
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {msg.content.startsWith("/uploads/") ? (
              <img
                src={msg.content}
                alt="Uploaded"
                className="max-w-full h-auto rounded-lg shadow-md"
                width="20%"
              />
            ) : (
              <p className="text-lg">{msg.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl border-b-2 border-gray-300 outline-none text-lg p-2 mt-4 flex items-center relative">
        {imagePreview && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-15 h-12 rounded-lg shadow-md mr-2"
            />
          </div>
        )}
         <input
            type="text"
            placeholder="Describe your image or write something..."
            value={message}
            onChange={handleInputChange}
            className="w-full pl-16 outline-none"
          />
      </div>

      <div className="flex justify-center gap-4 md:gap-0 md:justify-between md:w-[55%] mt-5 flex-col-reverse md:flex-row">
        <button
          onClick={handleGoDeeper}
          className={`bg-gray-900 mt-5 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-700 transition duration-200 ${
            loading ? "cursor-wait" : ""
          }`}
          disabled={loading || !chat_id} // Disable the button when loading
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-transparent border-gray-300 rounded-full animate-spin"></div> // Tailwind spinner
          ) : (
            "Go Deeper"
          )}
          <span className="text-gray-300 text-sm">(⌘ + ↵)</span>
        </button>

        <div className="flex gap-4 mt-4 text-gray-500 text-lg justify-center">
          <FaImage className="cursor-pointer" onClick={handleImageClick} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <FaMicrophone className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
