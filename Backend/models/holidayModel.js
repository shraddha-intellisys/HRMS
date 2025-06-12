const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  name: { type: String, required: true },
  reason: { type: String },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Holiday', holidaySchema);
