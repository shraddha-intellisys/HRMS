const express = require('express');
const router = express.Router();
const { getAllHolidays } = require('../controllers/holidayController');

router.get('/holidays', getAllHolidays);

module.exports = router;
