const mongoose = require("mongoose");

const intializeDbconnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://tonnymdb:${process.env.DB_PASSWORD}@neog-cluster.fra7p.mongodb.net/videoLibrary?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("connected successfully to the database");
  } catch (error) {
    console.log("Connection to the db failed", error);
  }
};

module.exports = { intializeDbconnection };
