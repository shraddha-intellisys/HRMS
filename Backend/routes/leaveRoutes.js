const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Submit Leave API
router.post('/', async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    await newLeave.save();
    res.status(201).json({ message: 'Leave submitted successfully!' });
  } catch (err) {
    console.error('❌ Error saving leave:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Holidays API
router.get('/holidays', (req, res) => {
  const holidays = [
    { name: 'Republic Day', date: '2025-01-26' },
    { name: 'Independence Day', date: '2025-08-15' },
  ];
  res.status(200).json(holidays);
});

module.exports = router;
