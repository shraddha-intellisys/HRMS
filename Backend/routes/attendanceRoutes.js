const express = require('express');
const router = express.Router();
const {
  markIn,
  markOut,
  getAttendanceByDate,
  getAllAttendance,
} = require('../controllers/attendanceController');
const { getAttendanceEvents } = require('../controllers/attendanceController');
// Routes
router.post('/mark-in', markIn);
router.post('/mark-out', markOut);
router.get('/attendance-events', getAttendanceEvents);
router.get('/attendance/:employeeCode/date/:date', async (req, res) => {
  const { employeeCode, date } = req.params;
  try {
    const attendance = await Attendance.findOne({ employeeCode, date });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

exports.getAttendanceEvents = async (req, res) => {
  try {
    // Fetch all attendance events from the database
    const events = await Attendance.find();  // Modify the query as per your needs

    // Return the events in the response
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching attendance events:', error);
    res.status(500).json({ message: 'Error fetching attendance events' });
  }
};

  
router.get('/attendance/:employeeCode/all', getAllAttendance);

module.exports = router;
