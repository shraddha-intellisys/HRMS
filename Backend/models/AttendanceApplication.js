const mongoose = require('mongoose');

const AttendanceApplicationSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeCode: { type: String, required: true },
  applicationDate: { type: String, required: true },
  applicationType: { type: String, required: true },
  leaveType: { type: String, required: true },
  reason: { type: String, required: true },
  remarks: { type: String },
  ccTo: { type: String },
  attendanceBasis: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  fromDate: { type: String },
  toDate: { type: String },
  fromHalf: { type: Boolean },
  firstHalf: { type: Boolean },
  secondHalf: { type: Boolean },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceApplication', AttendanceApplicationSchema);