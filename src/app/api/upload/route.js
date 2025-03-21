import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req) {
  try {
    // Ensure request is multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    return NextResponse.json({ imagePath, message: "I have seen the image. What is your question regarding this?" });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
