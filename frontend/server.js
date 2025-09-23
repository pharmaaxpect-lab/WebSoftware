const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

// set ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



// =========== Login Home Page ======================

app.get("/", (req, res) => {
  res.render("login"); // views/login.ejs
});

// app.get("/", (req, res) => {
//   res.send("<h1>✅ Frontend is running!</h1>");
// });

app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));