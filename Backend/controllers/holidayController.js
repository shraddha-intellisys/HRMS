const Holiday = require('../models/holidayModel');

// Add or Update Holiday
exports.addOrUpdateHoliday = async (req, res) => {
  const { date, name, reason } = req.body;
  try {
    const holidayDate = new Date(date);
    const holiday = await Holiday.findOneAndUpdate(
      { date: holidayDate },
      { name, reason, approved: false },
      { upsert: true, new: true }
    );
    res.json(holiday);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save holiday' });
  }
};

// Approve Holiday
exports.approveHoliday = async (req, res) => {
  const { date } = req.body;
  try {
    const holidayDate = new Date(date);
    const holiday = await Holiday.findOneAndUpdate(
      { date: holidayDate },
      { approved: true },
      { new: true }
    );
    res.json(holiday);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve holiday' });
  }
};

// Fetch All Holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({});
    res.json(holidays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
};
