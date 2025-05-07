const express = require('express');
const router = express.Router();
const { getHolidaysByMonth, addHoliday } = require('../controllers/holidayController');

// Route to get holidays by month
router.get('/:year/:month', getHolidaysByMonth);
router.post('/', addHoliday);

module.exports = router;
