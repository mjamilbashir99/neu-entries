// import { NextResponse } from "next/server";
// import Connection from "@/utils/db"; // Ensure this points to your database connection
// import Chat from "@/models/Chat"; // Ensure this is your Mongoose model

import { NextResponse } from "next/server";
import Connection from "../../../../app/dbconfig/dbconfig";
import Chat from "../../../../../model/Chat";
import User from "../../../../../model/UserModel";

export async function GET(req) {
    try {
      await Connection();
  
      const { searchParams } = new URL(req.url);
      const chat_id = searchParams.get("chat_id");
  
      if (!chat_id) {
        return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
      }
  
      // Find the user_id associated with the chat_id
      const chat = await Chat.findOne({ chat_id });
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
  
      const user = await User.findOne({ _id: chat.user_id });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      // If user has paid subscription, allow unlimited responses
      if (user.paid_for_subscription === 1) {
        return NextResponse.json({ count: "unlimited" }, { status: 200 });
      }
  
      // Count responses if the user is not subscribed
      const responseCount = await Chat.countDocuments({ chat_id, type: "response" });
  
      return NextResponse.json({ count: responseCount }, { status: 200 });
  
    } catch (error) {
      console.error("Error counting responses:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }