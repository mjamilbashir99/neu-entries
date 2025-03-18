import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Use existing model if already compiled, otherwise create a new one
const admin = mongoose.models.admin || mongoose.model("admin", AdminSchema);

export default admin;
