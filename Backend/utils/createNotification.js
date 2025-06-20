const Notification = require('../models/Notification');

const createNotification = async (title, message) => {
  try {
    const notification = new Notification({ title, message });
    await notification.save();
  } catch (err) {
    console.error('Notification Error:', err.message);
  }
};

module.exports = createNotification;
