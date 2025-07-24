const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected (important for tests that might import server.js multiple times)
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected.');
      return mongoose; // Return existing mongoose instance
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser and useUnifiedTopology are no longer needed for Mongoose 6+
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return mongoose; // Return the mongoose instance
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
