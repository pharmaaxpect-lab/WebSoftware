const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");   // ✅ Import missing tha
const connectDB = require("./config/db");

const app = express();

// ✅ Load env variables
dotenv.config();

// ✅ Connect Database
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/admin", require("./routes/adminRoutes"));
app.use("/personal", require("./routes/deoRoutes"));  // better: /api/deo

app.use("/", require("./routes/userRoutes")); // consistent naming
app.use("/customers", require("./routes/customerRoutes"));

app.use("/caller", require("./routes/callerRoutes"));

app.use("/caller/auth", require("./routes/callerAuth"));
app.use("/admin/auth", require("./routes/adminAuth"));
app.use("/api/deo/auth", require("./routes/deoAuth"));

// ✅ Import & use Admin routes

app.use("/personal/admin", require("./routes/adminpersonalRoutes"));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ Server Start
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
