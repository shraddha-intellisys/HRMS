const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance'); 
const {
  markIn,
  markOut,
  getAttendanceByEmployee
} = require('../controllers/attendanceController');

router.post('/attendance/mark-in', markIn);
router.post('/attendance/mark-out', markOut);
router.get('/attendance/:employeeCode', getAttendanceByEmployee);
router.post('/attendance-application/cancel', async (req, res) => {
  try {
    const { employeeCode, applicationDate } = req.body;

    if (!employeeCode || !applicationDate) {
      return res.status(400).json({ message: 'Missing employeeCode or applicationDate' });
    }

    const deleted = await Attendance.deleteOne({
      employeeCode,
      date: applicationDate
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'No record found for cancellation' });
    }

    res.status(200).json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('❌ Cancel Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
