import mongoose from "mongoose";

const LikeFeedBackSchema = new mongoose.Schema(
  {
    likefeedback: { type: String, required: true },
  },
  { timestamps: true }
);

// Use existing model if already compiled, otherwise create a new one
const Likefeedback =
  mongoose.models.Likefeedback ||
  mongoose.model("Likefeedback", LikeFeedBackSchema);

export default admin;
