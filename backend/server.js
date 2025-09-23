const express = require("express");
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./config/db");

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));