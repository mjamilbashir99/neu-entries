// import mongoose from "mongoose";

// const Connection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//   }
// };

// export default Connection;
import mongoose from "mongoose";

const Connection = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default Connection;
