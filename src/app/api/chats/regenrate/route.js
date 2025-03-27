import { NextResponse } from "next/server";
import Connection from "../../../../app/dbconfig/dbconfig";
import Chat from "../../../../../model/Chat";

export async function PATCH(req) {
  try {
    await Connection();
    const { chatId, responseId, newMessage } = await req.json();

    if (!chatId || !responseId || !newMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the existing response message
    await Chat.findByIdAndUpdate(responseId, { message: newMessage });

    return NextResponse.json({ success: true, newMessage }, { status: 200 });
  } catch (error) {
    console.error("Error updating response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
