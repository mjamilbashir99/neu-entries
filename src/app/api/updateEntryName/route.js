import { NextResponse } from "next/server";
import Connection from "@/app/dbconfig/dbconfig"; // Use your DB connection file
import Entry from "../../../../model/EntriesModel"; // Import the Entry model

export async function PATCH(req) {
  try {
    const { chat_id, entry_name } = await req.json();

    if (!chat_id || !entry_name) {
      return NextResponse.json(
        { error: "Missing chat_id or entry_name" },
        { status: 400 }
      );
    }

    await Connection(); // Ensure database is connected

    const updatedEntry = await Entry.findByIdAndUpdate(
      chat_id,
      { entry_name },
      { new: true }
    );

    if (!updatedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Entry name updated successfully", updatedEntry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating entry name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
