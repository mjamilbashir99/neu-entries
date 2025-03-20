// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect"; // Utility to connect to MongoDB
// import Chat from "@/models/Chat";


import { NextResponse } from "next/server";
import Connection from "../../../app/dbconfig/dbconfig";
import Chat from "../../../../model/Chat";

export async function POST(req) {
  try {
    await Connection(); // Ensure DB is connected
    const { user_id, chat_id, message, type } = await req.json();

    if (!user_id || !chat_id || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newChat = await Chat.create({ user_id, chat_id, message, type });
    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
