const express = require("express");
const dotenv = require("dotenv");
const { readdirSync } = require('fs');
const { connectDb } = require("./connection");

const app = express();

readdirSync('./routes').map(route => app.use('/api', require(`./routes/${route}`)))

dotenv.config();
connectDb()
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});
