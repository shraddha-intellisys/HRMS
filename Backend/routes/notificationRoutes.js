const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications for a specific user (pass userId in query)
router.get('/', notificationController.getNotifications);

// POST to mark all notifications as read (pass userId in body)
router.post('/mark-as-read', notificationController.markAllAsRead);

module.exports = router;
