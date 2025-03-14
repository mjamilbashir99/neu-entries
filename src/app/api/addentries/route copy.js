// import { NextResponse } from "next/server";
// // import Entry from "../../../../model/EntriesModel";
// import Connection from "@/app/dbconfig/dbconfig";
// import fs from "fs";
// import path from "path";
// // import { MongoClient } from "mongodb"; // Import MongoDB client

// // Assuming this is your DB connection
// export async function POST(req) {
//   await Connection();
//   const formData = await req.formData();

//   const imageFile = formData.get("image");
//   const voiceChatFile = formData.get("voiceChat");

//   // Generate file paths where you want to save the image and voice chat files
//   const imagePath = path.join(
//     process.cwd(),
//     "uploads",
//     "images",
//     imageFile.name
//   );
//   const voiceChatPath = path.join(
//     process.cwd(),
//     "uploads",
//     "voice",
//     voiceChatFile.name
//   );

//   // Create the necessary directories if they don't exist
//   if (!fs.existsSync(path.dirname(imagePath))) {
//     fs.mkdirSync(path.dirname(imagePath), { recursive: true });
//   }

//   if (!fs.existsSync(path.dirname(voiceChatPath))) {
//     fs.mkdirSync(path.dirname(voiceChatPath), { recursive: true });
//   }

//   // Create writable streams to save the files locally
//   const imageFileStream = fs.createWriteStream(imagePath);
//   const voiceChatFileStream = fs.createWriteStream(voiceChatPath);

//   // Pipe the incoming files to their respective writable streams
//   imageFile.stream().pipe(imageFileStream);
//   voiceChatFile.stream().pipe(voiceChatFileStream);

//   // Return a success response with the file paths
//   return NextResponse.json({
//     message: "Files uploaded successfully",
//     imagePath,
//     voiceChatPath,
//   });
// }

// // import { v4 as uuidv4 } from "uuid"; // Use UUID to generate unique filenames
// // import path from "path";
// // import fs from "fs";
// // import { NextResponse } from "next/server";
// // // import Connection from "@/app/dbconfig/dbconfig";
// // // import Entry from "../../../../model/EntriesModel";

// // export async function POST(req) {
// //   // await Connection();
// //   const formData = await req.formData();

// //   const imageFile = formData.get("image");
// //   const voiceChatFile = formData.get("voiceChat");

// //   // Generate unique file names using UUID to avoid overwriting
// //   const uniqueImageFileName = uuidv4() + path.extname(imageFile.name);
// //   const uniqueVoiceChatFileName = uuidv4() + path.extname(voiceChatFile.name);

// //   // Generate file paths where you want to save the image and voice chat files
// //   const imagePath = path.join(
// //     process.cwd(),
// //     "uploads",
// //     "images",
// //     uniqueImageFileName
// //   );
// //   const voiceChatPath = path.join(
// //     process.cwd(),
// //     "uploads",
// //     "voice",
// //     uniqueVoiceChatFileName
// //   );

// //   // Create the necessary directories if they don't exist
// //   if (!fs.existsSync(path.dirname(imagePath))) {
// //     fs.mkdirSync(path.dirname(imagePath), { recursive: true });
// //   }

// //   if (!fs.existsSync(path.dirname(voiceChatPath))) {
// //     fs.mkdirSync(path.dirname(voiceChatPath), { recursive: true });
// //   }

// //   // Create writable streams to save the files locally
// //   const imageFileStream = fs.createWriteStream(imagePath);
// //   const voiceChatFileStream = fs.createWriteStream(voiceChatPath);

// //   // Pipe the incoming files to their respective writable streams
// //   imageFile.stream().pipe(imageFileStream);
// //   voiceChatFile.stream().pipe(voiceChatFileStream);

// //   // After saving files, save file paths to the database
// //   await saveToDatabase(imagePath, voiceChatPath);

// //   // Return a success response with the file paths
// //   return NextResponse.json({
// //     message: "Files uploaded and saved to database successfully",
// //     imagePath,
// //     voiceChatPath,
// //   });
// // }
