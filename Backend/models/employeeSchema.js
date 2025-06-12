const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true, lowercase: true },
  employeeCode: { type: String, required: false, trim: true },
  gender: { type: String, required: false },
  location: { type: String, trim: true },
  department: { type: String, required: false, trim: true },
  manager: { type: String, trim: true },
  joiningDate: { type: Date, required: false },
  salary: { type: Number, required: false },
  panNumber: { type: String, required: false },
  aadharNumber: { type: String, required: false },
  branch: { type: String, trim: true },
  grade: { type: String, trim: true },
  designation: { type: String, required: false },
  projectType: { type: String, trim: true },
  dateOfBirth: { type: Date, required: false },
  epsJoiningDate: { type: Date },
  epsExitDate: { type: Date },
  esicNo: { type: String },
  previousMemberId: { type: String },
  epsNo: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
