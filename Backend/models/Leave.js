const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeName: String,
  employeeCode: String,
  applicationDate: Date,
  applicationType: String,
  leaveType: String,
  fromDate: Date,
  toDate: Date,
  reason: String,
  remarks: String,
  ccTo: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: String,        // Who approved
  approvedDate: Date,        // When it was approved

  rejectedBy: String,        // Who rejected
  rejectionReason: String,   // Why it was rejected
  rejectedDate: Date         // When it was rejected
});

module.exports = mongoose.model('Leave', leaveSchema);
