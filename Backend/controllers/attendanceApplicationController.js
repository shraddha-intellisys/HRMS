const AttendanceApplication = require('../models/AttendanceApplication');

// ✅ Submit Application
exports.submitAttendance = async (req, res) => {
  try {
    const data = req.body;
    // validation here if needed
    const newApp = new AttendanceApplication(data);
    await newApp.save();
    res.status(200).json({ message: 'Attendance application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




// ✅ Cancel Application
exports.cancelApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;
    // Perform cancellation logic here (e.g., delete or update status)
    // Example:
    // await AttendanceApplication.findByIdAndUpdate(applicationId, { status: 'cancelled' });

    res.status(200).json({ message: 'Application cancelled successfully' });
  } catch (err) {
    console.error('❌ Cancel Error:', err.message);
    res.status(500).json({ message: 'Server error while cancelling application' });
  }
};

// Fetch PBM entries
exports.getPBMAttendance = async (req, res) => {
  try {
    const data = await AttendanceApplication.find({ status: 'PBM' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching PBM attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all attendance requests (approved or all types)
exports.getAllAttendance = async (req, res) => {
  try {
    const data = await AttendanceApplication.find(); // Or filter by status/empId
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingApplications = async (req, res) => {
  try {
    const pending = await AttendanceApplication.find({ status: 'pending' });
    res.status(200).json(pending);
  } catch (error) {
    console.error('❌ Error fetching pending applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApprovedApplications = async (req, res) => {
  try {
    const approvedApps = await AttendanceApplication.find({ status: 'approved' });
    res.json(approvedApps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approved attendance applications' });
  }
};

// ✅ Approve Application
exports.approveApplication = async (req, res) => {
  const { empId, applicationDate } = req.body;
  try {
    const result = await AttendanceApplication.updateOne(
      { empId, applicationDate },
      { $set: { approved: true } }
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Reject Application (FIXED: key `employeeCode`)
exports.rejectApplication = async (req, res) => {
  const { empId, applicationDate } = req.body;
  try {
    const result = await AttendanceApplication.updateOne(
      { empId, applicationDate },
      { $set: { rejected: true } }
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.approveAttendanceApplication = async (req, res) => {
  try {
    // Your approval logic here
    res.status(200).json({ message: "Attendance approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving attendance", error: err.message });
  }
};

exports.rejectAttendanceApplication = async (req, res) => {
  try {
    // Your rejection logic here
    res.status(200).json({ message: "Attendance rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting attendance", error: err.message });
  }
};