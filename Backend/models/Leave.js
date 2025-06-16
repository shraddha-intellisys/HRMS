const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  empName: { type: String, required: true },
  empId: { type: String, required: true },

  applicationDate: { type: String, required: true },
  applicationType: { type: String, required: true },
  leaveType: { type: String, required: true },

  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },

  reason: { type: String },
  remarks: { type: String },
  ccTo: { type: String },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  approvedBy: String,
  approvedDate: String,

  rejectedBy: String,
  rejectionReason: String,
  rejectedDate: String
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
