const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    const cnn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${cnn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
