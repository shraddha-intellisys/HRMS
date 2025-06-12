const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
  empId: String,
  month: String,
  filePath: String
});

module.exports = mongoose.model('Payslip', payslipSchema);
