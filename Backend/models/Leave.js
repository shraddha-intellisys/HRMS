const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  applicationDate: { type: Date, required: true },
  applicationType: { type: String, required: true },
  leaveType: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String },
  remarks: { type: String },
  ccEmail: { type: String }
});

module.exports = mongoose.model('Leave', leaveSchema);
