import mongoose, { Schema } from "mongoose";

const EntrySchema = new Schema(
  {
    prompt: {
      type: String,
      timestamp: Date,
    },
    image: {
      type: String,
    },
    voiceChat: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a model for the schema
const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

export default Entry;
