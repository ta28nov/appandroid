const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure MONGODB_URI is loaded from .env
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Set strictQuery to false to prepare for Mongoose 7 default behavior
    // (avoids deprecation warning)
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,      // Although deprecated, sometimes needed for older connection strings
      useUnifiedTopology: true, // Recommended for new engine
      // useCreateIndex: true,    // Deprecated and removed in Mongoose 6
      // useFindAndModify: false, // Deprecated and removed in Mongoose 6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB; 