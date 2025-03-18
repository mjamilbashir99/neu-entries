// import mongoose, { Schema } from "mongoose";

// const UserSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.models.Entries || mongoose.model("User", UserSchema);

// export default User;
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    googleId: { type: String, unique: true },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
