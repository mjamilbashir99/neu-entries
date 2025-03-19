

// import Connection from "../../../app/dbconfig/dbconfig";
// import Entry from "../../../../model/EntriesModel"; // Import Mongoose model
// import { NextResponse } from "next/server";



import { NextResponse } from "next/server";
import dbConnect from "../../../app/dbconfig/dbconfig";
import Entry from "../../../../model/EntriesModel";

// Handle POST request
export async function POST(req) {
  try {
    await dbConnect(); // Ensure DB connection

    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Generate a random string
    

    const generateRandomString = (length = 16) => {
        return [...Array(length)]
          .map(() => Math.random().toString(36).charAt(2)) // Get one random alphanumeric character
          .join("");
      };
      
      const randomString = generateRandomString();
      console.log(randomString);

    // Create new entry
    const newEntry = await Entry.create({
      entry_name: "Empty Entry...",
      random_string: randomString,
      user_id,
      date: new Date(),
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: "Error creating entry" }, { status: 500 });
  }
}
