const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Submit leave
router.post('/submit', async (req, res) => {
  try {
    const leave = new Leave({ ...req.body, status: 'Pending' });
    await leave.save();
    res.status(201).json({ message: 'Leave submitted successfully', leave });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting leave', error: error.message });
  }
});

// Get all leaves
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaves', error: error.message });
  }
});

// Get only pending leaves
router.get('/pending', async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: 'Pending' });
    res.json(pendingLeaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get only approved leaves (for calendar)
router.get('/approved', async (req, res) => {
  try {
    const approvedLeaves = await Leave.find({ status: 'Approved' });
    res.json(approvedLeaves);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approved leaves', error: err.message });
  }
});

// Approve leave
router.patch('/approve/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, {
      status: 'Approved',
      approvedDate: new Date(),
      approvedBy: req.body.approvedBy || 'Admin'
    }, { new: true });

    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json({ message: 'Leave approved', leave });
  } catch (err) {
    res.status(500).json({ message: 'Error approving leave', error: err.message });
  }
});

// Reject leave
router.patch('/reject/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, {
      status: 'Rejected',
      rejectedDate: new Date(),
      rejectionReason: req.body.rejectionReason || 'Not specified',
      rejectedBy: req.body.rejectedBy || 'Admin'
    }, { new: true });

    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json({ message: 'Leave rejected', leave });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting leave', error: err.message });
  }
});

// Get only rejected leaves
router.get('/rejected', async (req, res) => {
  try {
    const rejectedLeaves = await Leave.find({ status: 'Rejected' });
    res.json(rejectedLeaves);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rejected leaves', error: err.message });
  }
});


module.exports = router;
