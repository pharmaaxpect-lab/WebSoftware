const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  admin_id: { type: String },
  deo_id: { type: String },
  caller_id: { type: String },
  name: { type: String },
  mob_no: { type: String },
  email_id: { type: String },
  state: { type: String },
  address: { type: String },
  query_date: { type: String },
  lead_status: { type: String },
  comment: { type: String },
  alert_time: { type: String },
  final_confirm: { type: String },

  // ✅ Hide/Unhide feature
  hidden: { type: Boolean, default: false }

}, { 
  timestamps: true,
  collection: "customers"   // ✅ दोनों options एक ही object में
});

// Export model
module.exports = mongoose.model("Customer", userSchema);
