const mongoose = require("mongoose");
const connectDB = () => {
  try {
    mongoose.connect(`${process.env.MONGOURI}`).then((data) => {
      console.log("Connected to db ", data.connection.host);
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
