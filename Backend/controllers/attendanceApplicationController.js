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

// ✅ Approve Application
exports.approveApplication = async (req, res) => {
  try {
    const { empId, applicationDate } = req.body;

    const updated = await AttendanceApplication.findOneAndUpdate(
      { employeeCode: empId, applicationDate },
      { $set: { status: 'Approved' } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application approved', data: updated });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ✅ Reject Application (FIXED: key `employeeCode`)
exports.rejectApplication = async (req, res) => {
  try {
    const { empId, applicationDate } = req.body;

    const updated = await AttendanceApplication.findOneAndUpdate(
      { employeeCode: empId, applicationDate },
      { status: 'rejected' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json({ message: 'Application rejected', data: updated });
  } catch (error) {
    console.error('❌ Error rejecting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};