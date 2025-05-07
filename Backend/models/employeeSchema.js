const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  employeeCode: { type: String, unique: true, sparse: true, trim: true },
  location: { type: String, trim: true },
  department: { type: String, required: true, trim: true },
  manager: { type: String, trim: true },
  joiningDate: { type: Date, required: true },
  salary: { type: Number, required: true, min: 0 },
  panNumber: { type: String, unique: true, sparse: true, trim: true, uppercase: true },
  aadharNumber: { type: String, unique: true, sparse: true, trim: true },
  branch: { type: String, trim: true },
  grade: { type: String, trim: true },
  designation: { type: String, trim: true },
  projectType: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  dateOfBirth: { type: Date, required: true },
  epsJoiningDate: { type: Date },
  epsExitDate: { type: Date },
  esicNo: { type: String, trim: true },
  epfJoiningDate:{type:Date},
  previousMemberId: { type: String, trim: true },
  epsNo: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
