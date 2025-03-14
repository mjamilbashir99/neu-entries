// import { writeFile } from "fs/promises";
// import path from "path";
// import { NextResponse } from "next/server";
// import Connection from "../../dbconfig/dbconfig";
// import Audio from "../../../../model/Audio";

// export async function POST(req) {
//   try {
//     await Connection();

//     const formData = await req.formData();
//     const file = formData.get("audio");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Define save path
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(process.cwd(), "public/uploads", fileName);

//     // Save file to server
//     await writeFile(filePath, buffer);
//     const fileUrl = `/uploads/${fileName}`;

//     // Save file URL to MongoDB
//     const newAudio = new Audio({ url: fileUrl });
//     await newAudio.save();

//     return NextResponse.json({ message: "File uploaded", url: fileUrl });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
