const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  month: { type: String, required: true }
});

module.exports = mongoose.model('Holiday', holidaySchema);
