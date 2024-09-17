const express = require("express");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const { connectDb } = require("./connection");
const cors = require("cors");
_ = require("underscore");
const app = express();
dotenv.config();
const whitelist = ['http://localhost:5173', 'https://pic-prism-server-gjww.onrender.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions))

// Middleware
// app.use(cors());
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
