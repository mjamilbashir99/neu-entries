import { NextResponse } from "next/server";
import Connection from "../../../app/dbconfig/dbconfig";
import Chat from "../../../../model/Chat";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    await Connection();
    
    const formData = await req.formData(); // Handle FormData request
    const user_id = formData.get("user_id");
    const chat_id = formData.get("chat_id");
    const message = formData.get("message");
    const type = formData.get("type");
    const image = formData.get("image"); // Get uploaded image

    if (!user_id || !chat_id || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (image) {
      // Store image in a folder or use a cloud service (e.g., Cloudinary, S3)
      const imagePath = `/uploads/${Date.now()}_${image.name}`;
      // Save file to your server (adjust as needed)
      // fs.writeFileSync(`./public${imagePath}`, Buffer.from(await image.arrayBuffer()));

      imageUrl = imagePath; // Store image URL in DB
    }

    const newChat = await Chat.create({ user_id, chat_id, message, type, image: imageUrl });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await Connection();
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get("chat_id");

    if (!chat_id) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const chats = await Chat.find({ chat_id }).sort({ createdAt: 1 });
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
