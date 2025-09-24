const User = require("../models/User");
const csv = require("csvtojson");

const importUser = async (req, res) => {
  try {
    // 🔴 Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    // 🔴 Convert CSV to JSON
    const response = await csv().fromFile(req.file.path);

    // 🔴 Prepare userData array
    const userData = response.map(row => ({
      admin_id: null,
      deo_id: null,
      caller_id: null,
      name: row.Name && row.Name.trim() !== "" ? row.Name : null,
      mob_no: row.Mobile && row.Mobile.trim() !== "" ? row.Mobile : null,
      email_id: row.Email && row.Email.trim() !== "" ? row.Email : null,
      state: row.State && row.State.trim() !== "" ? row.State : null,
      address: row.Address && row.Address.trim() !== "" ? row.Address : null,
      query_date: row.QueryDate && row.QueryDate.trim() !== "" ? row.QueryDate : null,
      lead_status: null,
      comment: null,
      alert_time: null,
      final_confirm: null,
    }));

    // 🔴 Insert into DB
    const inserted = await User.insertMany(userData);

    // 🔴 Send response AFTER insert is complete
    res.status(200).json({
      success: true,
      msg: "CSV Imported Successfully",
      count: inserted.length,
      insertedData: inserted  // Optional: show inserted documents
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { importUser };
