const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    empID: String,
    userID: String
});

module.exports = mongoose.model('User', userSchema);
