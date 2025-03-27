import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    chatid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: String,
      default: "",
    },
    dislike: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
