const Attendance = require('../models/Attendance');
const moment = require('moment');

// Mark In
exports.markIn = async (req, res) => {
  try {
    const { employeeCode } = req.body;
    const dateToday = moment().format('YYYY-MM-DD');
    const timeNow = moment().format('HH:mm:ss');

    let attendance = await Attendance.findOne({ employeeCode, date: dateToday });

    if (!attendance) {
      attendance = new Attendance({
        employeeCode,
        date: dateToday,
        markInTime: timeNow,
      });
    } else {
      attendance.markInTime = timeNow;
    }

    await attendance.save();
    res.json({ message: 'Marked In Successfully', markInTime: timeNow });
  } catch (error) {
    console.error('❌ Mark In Error:', error);  // Log the full error
    res.status(500).json({ message: 'Server Error during Mark In', error: error.message });
  }
};

exports.markOut = async (req, res) => {
  try {
    const { employeeCode } = req.body;
    const dateToday = moment().format('YYYY-MM-DD');
    const timeNow = moment().format('HH:mm:ss');

    const attendance = await Attendance.findOne({ employeeCode, date: dateToday });

    if (!attendance) {
      return res.status(404).json({ message: 'Mark In not done yet!' });
    }

    attendance.markOutTime = timeNow;
    attendance.status = 'completed';
    await attendance.save();

    res.json({ message: 'Marked Out Successfully', markOutTime: timeNow });
  } catch (error) {
    console.error('❌ Mark Out Error:', error);  // Log the full error
    res.status(500).json({ message: 'Server Error during Mark Out', error: error.message });
  }
};



// Get Attendance by Date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { employeeCode, date } = req.params;  // Extract employeeCode and date from the URL params

    console.log(`Fetching attendance for ${employeeCode} on ${date}`); // Log to check if it's hitting the route

    const attendance = await Attendance.findOne({ employeeCode, date });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.json({
      markInTime: attendance.markInTime,
      markOutTime: attendance.markOutTime,
    });
  } catch (error) {
    console.error('❌ Fetch Error:', error.message);
    res.status(500).json({ message: 'Server Error fetching attendance' });
  }
};

// Get Attendance by Employee and Date
exports.getAttendanceByEmployeeAndDate = async (req, res) => {
  const { employeeId, date } = req.params;

  try {
    const attendance = await Attendance.findOne({
      employeeCode: employeeId,
      date: date,
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found for this employee and date' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance by employee and date:', error);
    res.status(500).json({ message: 'Error fetching attendance data', error: error.message });
  }
};

// Get All Records by Employee
exports.getAllAttendance = async (req, res) => {
  const { employeeCode } = req.params;

  try {
    const allAttendance = await Attendance.find({ employeeCode });

    if (!allAttendance || allAttendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this employee' });
    }

    res.status(200).json(allAttendance);
  } catch (error) {
    console.error('❌ Error fetching all attendance:', error);
    res.status(500).json({ message: 'Server Error while fetching attendance records', error: error.message });
  }
};

// Submit Attendance (Manually Created)
exports.submitAttendanceApplication = async (req, res) => {
  try {
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

    // Ensure all required fields are provided
    if (!employeeName || !employeeCode || !applicationDate || !applicationType || !leaveType || !attendanceBasis) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new attendance application record
    const newApplication = new AttendanceApplication({
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
    });

    // Save the new application to the database
    await newApplication.save();

    // Respond with success
    res.status(200).json({ message: 'Attendance application submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting attendance application:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Get All Attendance Events (For Calendar or Display Purposes)
exports.getAttendanceEvents = async (req, res) => {
  try {
    // Fetch all attendance events from the database (adjust query as needed)
    const events = await Attendance.find();

    // Map events to include relevant fields like `status`, `date`, etc., for calendar display
    const formattedEvents = events.map(event => ({
      title: event.status,
      start: event.applicationDate,  // Ensure this is in ISO format
      backgroundColor: event.status === 'completed' ? '#4CAF50' : '#FF5722', // Conditional color based on status
      description: `Mark In: ${event.markInTime}, Mark Out: ${event.markOutTime}`,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching attendance events:', error);
    res.status(500).json({ message: 'Error fetching attendance events', error: error.message });
  }
};
