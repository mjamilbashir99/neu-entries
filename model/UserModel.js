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
    googleId: { type: String},
    accessToken: { type: String },
    refreshToken: { type: String },
    paid_for_subscription: { type: Number, default: 0 },
    subscriptionId: { type: String },
    subscriptionStatus: { type: String, default: "inactive" },
    token: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
