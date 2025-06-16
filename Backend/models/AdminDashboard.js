const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  title: String,
  date: String,
  type: String,
  notes: String
});

const EmpDocumentSchema = new mongoose.Schema({
  name: String
});

const TodoItemSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const NewJoineeSchema = new mongoose.Schema({
  name: String,
  joinDate: String,
  imageUrl: String
});

const AdminDashboardSchema = new mongoose.Schema({
  welcomeMessage: String,
  newsItems: [String],
  reminders: [ReminderSchema],
  feedItems: [String],
  empDocuments: [EmpDocumentSchema],
  todoItems: [TodoItemSchema],
  newJoinees: [NewJoineeSchema]
});

module.exports = mongoose.model('AdminDashboard', AdminDashboardSchema);
