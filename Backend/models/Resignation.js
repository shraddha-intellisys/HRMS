const mongoose = require('mongoose');

const ResignationSchema = new mongoose.Schema({
  employeeCode: String,
  employeeName: String,
  department: String,
  lastWorkingDate: String,
  reason: String,
  status: { type: String, default: 'pending' },
  submittedDate: { type: Date, default: Date.now },
  approvedDate: Date,
  rejectedDate: Date,
  rejectionReason: String
});

module.exports = mongoose.model('Resignation', ResignationSchema);
