const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true },
  date: { type: String, required: true },  // Ensure this matches the date format you are sending
  In: { type: String },
  Out: { type: String },
  status: { type: String, default: 'pending' },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
