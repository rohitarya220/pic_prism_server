const express = require("express");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const { connectDb } = require("./connection");
const cors = require("cors");

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

// Database connection
connectDb();

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
