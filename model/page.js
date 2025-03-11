import mongoose, { Schema } from "mongoose";

const EntrySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Check if model already exists in mongoose.models, and create or reuse the model
const Entries =
  mongoose.models.Entries || mongoose.model("Entries", EntrySchema);

export default Entries;
