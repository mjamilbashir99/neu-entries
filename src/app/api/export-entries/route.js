import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Connection from "@/app/dbconfig/dbconfig";
import Entry from "../../../../model/EntriesModel";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as docx from "docx";
import Chat from "../../../../model/Chat";
// import { Document, Packer, TextRun } from "docx"; 


export async function GET(req) {
    await Connection();
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const userId = session.user.id;
      const entries = await Entry.find({ user_id: userId });
  
      if (!entries.length) {
        return NextResponse.json({ error: "No entries found" }, { status: 404 });
      }
  
      const entrySections = [];
  
      // ✅ Add Center-Aligned Heading
      entrySections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "My Journal",
              bold: true,
              size: 36,
            }),
          ],
          alignment: docx.AlignmentType.CENTER, // ✅ Now it will work
          spacing: { after: 300 },
        })
      );
  
      // ✅ Add Generated Date
      const generatedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  
      entrySections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on ${generatedDate}`,
              italics: true,
              size: 24,
            }),
          ],
          alignment: docx.AlignmentType.CENTER, // ✅ Use 'docx.AlignmentType'
          spacing: { after: 400 },
        })
      );
  
      for (const entry of entries) {
        const firstMessage = await Chat.findOne({
          user_id: userId,
          chat_id: entry._id.toString(),
          type: "sent",
        }).sort({ createdAt: 1 });
      
        const firstResponse = await Chat.findOne({
          user_id: userId,
          chat_id: entry._id.toString(),
          type: "response",
        }).sort({ createdAt: 1 });
      
        const messageText = firstMessage
          ? `Message: ${firstMessage.message || "[No text]"}`
          : "Message: [No message found]";
      
        const responseText = firstResponse
          ? `AI Response: ${firstResponse.message || "[No response]"}`
          : "AI Response: [No response found]";
      
        // ✅ Entry Title (Left Aligned)
        entrySections.push(
          new docx.Paragraph({
            children: [
              new TextRun({
                text: `\nEntry: ${entry.entry_name}`,
                bold: true,
                size: 24,
              }),
            ],
            alignment: docx.AlignmentType.LEFT, // Ensure left alignment
            spacing: { after: 150 },
          })
        );
      
        // ✅ Entry Date (Left Aligned)
        entrySections.push(
          new docx.Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date(entry.date).toLocaleString()}`,
                size: 22,
              }),
            ],
            alignment: docx.AlignmentType.LEFT,
          })
        );
      
        // ✅ Message (Left Aligned)
        entrySections.push(
          new docx.Paragraph({
            children: [new TextRun({ text: `\n${messageText}`, size: 22 })],
            alignment: docx.AlignmentType.LEFT,
          })
        );
      
        // ✅ Response (Left Aligned)
        entrySections.push(
          new docx.Paragraph({
            children: [new TextRun({ text: `\n${responseText}\n`, size: 22 })],
            alignment: docx.AlignmentType.LEFT,
          })
        );
      }
      
      const doc = new Document({
        sections: [{ children: entrySections }],
      });
  
      const buffer = await Packer.toBuffer(doc);
  
      return new Response(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename=My_Journal.docx`,
        },
      });
    } catch (error) {
      console.error("Error exporting entries:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }