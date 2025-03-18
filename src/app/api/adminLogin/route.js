import { NextResponse } from "next/server";
import Connection from "@/app/dbconfig/dbconfig";
import admin from "../../../../model/Admin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    console.log("Received credentials:", username, password);

    await Connection();
    const Admin = await admin.findOne({ username });

    if (!Admin) {
      console.log("Admin not found");
      return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    }

    if (Admin.password !== password) {
      console.log("Invalid credentials");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Login successful");
    return NextResponse.json({
      message: "Login successful",
      adminId: Admin._id,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
