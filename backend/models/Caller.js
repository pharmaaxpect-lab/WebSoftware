const mongoose = require("mongoose");

const callerSchema = new mongoose.Schema({
  caller_id: { type: String, unique: true },
  name: { type: String, required: true },
  mob_no: { type: String, required: true, unique: true },
  email_id: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: "caller" });

// Pre-save hook to auto-generate caller_id
callerSchema.pre("save", async function (next) {
  if (!this.caller_id) {
    const count = await mongoose.model("Caller").countDocuments();
    this.caller_id = "CLR" + String(count + 1).padStart(3, "0");  
    // e.g. CLR001, CLR002
  }
  next();
});

module.exports = mongoose.model("Caller", callerSchema);