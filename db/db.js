const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected on : ${connect.connection.host}`);
  } catch (error) {
    throw new Error(`error occured`);
    
  }
};

module.exports = connectDB;
