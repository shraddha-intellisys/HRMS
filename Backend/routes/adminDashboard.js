const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');

router.get('/', adminDashboardController.getDashboard);
router.put('/', adminDashboardController.updateDashboard);

router.get('/public', adminDashboardController.getDashboardPublic);

module.exports = router;
