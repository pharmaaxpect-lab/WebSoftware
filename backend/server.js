const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));