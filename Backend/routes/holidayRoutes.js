const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');

router.post('/add', holidayController.addOrUpdateHoliday);
router.put('/approve', holidayController.approveHoliday);
router.get('/all', holidayController.getAllHolidays);

module.exports = router;
