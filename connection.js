const mongoose = require("mongoose"); 

const connectDb = async (req, res) => {
  const connection = await mongoose.connect(process.env.MONGO_URI);

  if (connection.STATES.connected) return console.log("database connected");
  if (connection.STATES.disconnected)
    return console.log("database disconnected");
};


module.exports = { connectDb };
