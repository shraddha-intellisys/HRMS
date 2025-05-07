// controllers/attendance-applicationController.js
const AttendanceApplication = require('../models/attendanceApplication');

// Controller to handle the attendance application
exports.submitAttendanceApplication = async (req, res) => {
  const {
    employeeName,
    employeeCode,
    applicationDate,
    applicationType,
    leaveType,
    reason,
    remarks,
    ccTo,
    attendanceBasis,
    startTime,
    endTime,
    fromDate,
    toDate,
    fromHalf,
    firstHalf,
    secondHalf,
  } = req.body;

  try {
    const attendanceApplication = new AttendanceApplication({
      employeeName,
      employeeCode,
      applicationDate,
      applicationType,
      leaveType,
      reason,
      remarks,
      ccTo,
      attendanceBasis,
      startTime,
      endTime,
      fromDate,
      toDate,
      fromHalf,
      firstHalf,
      secondHalf,
      status: 'Manually Updated',
    });

    await attendanceApplication.save();
    res.status(201).json({ message: 'Attendance application submitted successfully', attendanceApplication });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error submitting attendance application', error });
  }
};

// Controller to handle canceling the attendance application
exports.cancelAttendanceApplication = async (req, res) => {
  const { employeeCode } = req.body;

  try {
    const attendanceApplication = await AttendanceApplication.findOneAndDelete({ employeeCode });

    if (!attendanceApplication) {
      return res.status(404).json({ message: 'Attendance application not found' });
    }

    res.status(200).json({ message: 'Attendance application canceled successfully', attendanceApplication });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error canceling attendance application', error });
  }
};

exports.getAttendanceEvents = async (req, res) => {
  try {
    // Fetch attendance events from the database
    const events = await Attendance.find(); // Adjust as needed for your database logic
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Endpoint to submit attendance
exports.submitAttendance = async (req, res) => {
  const { employeeName, employeeCode, applicationDate, status } = req.body;
  
  try {
    const newAttendance = new Attendance({
      employeeName,
      employeeCode,
      applicationDate,
      status: status || 'Manually Updated', // Set the status to "Manually Updated"
    });

    await newAttendance.save();
    res.status(201).json(newAttendance); // Send back the saved attendance
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};