const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true },
  date: { type: String, required: true },
  markInTime: { type: String },
  markOutTime: { type: String }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
