const Holiday = require('../models/Holiday');
const { addHolidayToCalendar } = require('../utils/googleCalendar');

// GET holidays for a specific month and year
exports.getHolidaysByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

    const holidays = await Holiday.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    res.json(holidays);
  } catch (error) {
    console.error('❌ Error fetching holidays:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addHoliday = async (req, res) => {
  try {
    const { holidayName, holidayDate } = req.body;

    // Create a new holiday entry
    const newHoliday = new Holiday({
      holidayName,
      holidayDate,
    });

    // Save the new holiday to the database
    await newHoliday.save();
    res.status(201).json({ message: 'Holiday added successfully' });
  } catch (error) {
    console.error('Error adding holiday:', error);
    res.status(500).json({ message: 'Failed to add holiday' });
  }
};
