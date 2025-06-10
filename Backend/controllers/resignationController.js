const Resignation = require('../models/Resignation');

// Submit resignation
exports.submitResignation = async (req, res) => {
  try {
    const resignation = new Resignation(req.body);
    await resignation.save();
    res.status(200).json({ message: 'Resignation submitted', data: resignation });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get all pending resignations
exports.getPendingResignations = async (req, res) => {
  try {
    const pending = await Resignation.find({ status: 'pending' });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Approve resignation
exports.approveResignation = async (req, res) => {
  try {
    const { empCode } = req.body;
    const updated = await Resignation.findOneAndUpdate(
      { employeeCode: empCode },
      { status: 'approved', approvedDate: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Resignation not found' });
    res.status(200).json({ message: 'Resignation approved', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Reject resignation
exports.rejectResignation = async (req, res) => {
  try {
    const { empCode } = req.body;
    const updated = await Resignation.findOneAndUpdate(
      { employeeCode: empCode },
      { status: 'rejected', rejectedDate: new Date(), rejectionReason: 'Manager rejected' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Resignation not found' });
    res.status(200).json({ message: 'Resignation rejected', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
