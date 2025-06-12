const mongoose = require('mongoose');

const AdminDashboardSchema = new mongoose.Schema({
  welcomeMessage: { type: String, default: '' },
  newsItems: [String],
  reminders: [{
    title: String,
    date: String,
    type: String,
    notes: String
  }],
  feedItems: [String],
  empDocuments: [{ name: String }],
  todoItems: [{
    task: String,
    completed: Boolean
  }],
  newJoinees: [{
    name: String,
    joinDate: String,
    imageUrl: String
  }]
});

module.exports = mongoose.model('AdminDashboard', AdminDashboardSchema);
