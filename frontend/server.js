const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Set EJS view engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Middleware ----------
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

// Default layout (optional, can override per route)
app.set("layout", "layouts/deo");

// ---------- Routes ----------

// DEO Dashboard
app.get("/deo/dashboard", (req, res) => {
  res.render("pages/deo/dashboard", {
    title: "DEO Dashboard",
    layout: "layouts/deo"
  });
});

// DEO Personal Details
app.get("/deo/personal_details", (req, res) => {
  res.render("pages/deo/personal_details", {
    title: "DEO Profile",
    layout: "layouts/deo"
  });
});

// DEO Support
app.get("/deo/support", (req, res) => {
  res.render("pages/deo/support", {
    title: "DEO Settings",
    layout: "layouts/deo"
  });
});

// Login Page (Home)
app.get("/", (req, res) => {
  res.render("login", { title: "Login", layout: false });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`✅ Frontend running at http://localhost:${PORT}`);
});
