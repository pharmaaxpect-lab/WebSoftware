const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, unique: true },
  name: { type: String, required: true },
  mob_no: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: "admin" });

// ✅ Pre-save hook to auto-generate admin_id
adminSchema.pre("save", async function (next) {
  if (!this.admin_id) {
    const count = await this.constructor.countDocuments();
    this.admin_id = "ADM" + String(count + 1).padStart(3, "0");  
    // e.g. ADM001, ADM002
  }
  next();
});

module.exports = mongoose.model("Admin", adminSchema);