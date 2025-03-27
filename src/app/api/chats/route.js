import { NextResponse } from "next/server";
import Connection from "../../../app/dbconfig/dbconfig";
import Chat from "../../../../model/Chat";

export async function POST(req) {
  try {
    await Connection();
    const { user_id, chat_id, message, type } = await req.json();

    if (!user_id || !chat_id || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newChat = await Chat.create({ user_id, chat_id, message, type });
    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await Connection();
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get("chat_id");

    if (!chat_id) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chats = await Chat.find({ chat_id }).sort({ createdAt: 1 }); // Sort by time
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
