import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("✅ Mongoose connected to MongoDB");
    });

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // exit app if DB fails
  }
};

export default connectDB;
