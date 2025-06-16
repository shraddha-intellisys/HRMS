const AttendanceApplication = require('../models/AttendanceApplication');

// ✅ Submit Application
exports.submitAttendance = async (req, res) => {
  try {
    const data = req.body;
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
    res.status(200).json({ message: 'Application cancelled successfully' });
  } catch (err) {
    console.error('❌ Cancel Error:', err.message);
    res.status(500).json({ message: 'Server error while cancelling application' });
  }
};

// ✅ Get Pending Requests
exports.getPendingApplications = async (req, res) => {
  try {
    const pending = await AttendanceApplication.find({ status: 'pending' });
    res.status(200).json(pending);
  } catch (err) {
    console.error('❌ Error fetching pending applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Approved Requests
exports.getApprovedAttendanceApplications = async (req, res) => {
  try {
    const approved = await AttendanceApplication.find({ status: 'approved' });
    res.status(200).json(approved);
  } catch (err) {
    console.error('❌ Error fetching approved applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Approve Attendance
exports.approveApplication = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await AttendanceApplication.updateOne(
      { _id: id },
      { $set: { status: 'approved' } }
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ message: 'Error approving attendance', error: err.message });
  }
};



// ✅ Reject Attendance
exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await AttendanceApplication.updateOne(
      { _id: id },
      { $set: { status: 'rejected' } }
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting attendance', error: err.message });
  }
};


