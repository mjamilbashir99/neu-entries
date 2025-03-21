import { NextResponse } from "next/server";
import Connection from "@/app/dbconfig/dbconfig";
import Entry from "../../../../model/EntriesModel";

export async function GET() {
  try {
    await Connection(); // Ensure database connection

    const chats = await Entry.find(); // Fetch chats from DB
    // console.log(chats,"chats ye hain");

    return NextResponse.json({ chats }, { status: 200 }); // Correct response format
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
