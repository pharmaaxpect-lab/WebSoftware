const mongoose = require("mongoose");

const deoSchema = new mongoose.Schema({
  deo_id: { type: String, unique: true },
  name: { type: String, required: true },
  mob_no: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: "deo" });

// Pre-save hook to auto-generate deo_id
deoSchema.pre("save", async function (next) {
  if (!this.deo_id) {
    // Count total docs
    const count = await mongoose.model("Deo").countDocuments();
    this.deo_id = "DEO" + String(count + 1).padStart(3, "0");  
    // e.g. DEO001, DEO002
  }
  next();
});

module.exports = mongoose.model("Deo", deoSchema);
