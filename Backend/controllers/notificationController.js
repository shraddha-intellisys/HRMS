const Notification = require('../models/Notification');

// GET /api/notifications?userId=EMP123
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const notifications = await Notification.find({
      $or: [{ recipient: userId }, { recipient: 'all' }]
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/notifications/mark-as-read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await Notification.updateMany(
      { $or: [{ recipient: userId }, { recipient: 'all' }] },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
