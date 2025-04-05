const mongoose = require('mongoose');
const connectDB = async () => {
  
  try {
    //setting strictQuery to false relaxes the rules around query filters, allowing you to use fields that are not part of the schema.
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }

}

module.exports = connectDB;