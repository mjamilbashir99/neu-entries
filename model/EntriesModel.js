import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    entry_name: {
      type: String,
      required: true,
      default: "Empty Entry...",
    },
    random_string: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to user
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
