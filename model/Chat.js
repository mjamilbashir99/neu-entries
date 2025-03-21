import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chat_id: { type: String, required: true },
  message: { type: String },
  image: { type: String }, // Store image path
  type: { type: String, enum: ["sent", "response"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

// export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
