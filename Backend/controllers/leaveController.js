
const Leave = require('../models/Leave');

exports.submitLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(200).json({ message: 'Leave submitted successfully' });
  } catch (error) {
    console.error('Error submitting leave:', error);
    res.status(500).json({ message: 'Failed to submit leave', error });
  }
};



