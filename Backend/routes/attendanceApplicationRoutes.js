// routes/attendance-application.js
const express = require('express');
const router = express.Router();
const { submitAttendanceApplication, cancelAttendanceApplication } = require('../controllers/attendanceApplicationController');
const { getAttendanceByEmployeeAndDate } = require('../controllers/attendanceController');
const attendanceController = require('../controllers/attendanceController');
// Route to submit attendance application
router.post('/', submitAttendanceApplication); 
// Route to cancel attendance application
router.post('/cancel', cancelAttendanceApplication);
router.get('/:employeeId/date/:date', getAttendanceByEmployeeAndDate);
router.get('/attendance/:employeeCode/date/:date', attendanceController.getAttendanceByDate);
router.post('/attendance-application', attendanceController.submitAttendanceApplication);



module.exports = router;
