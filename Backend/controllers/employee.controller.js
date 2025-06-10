const Employee = require('../models/employeeSchema');
const mongoose = require('mongoose');
const moment = require('moment');

// ✅ Add New Employee (One-time per user)
exports.addEmployee = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "❌ User ID missing in token." });
    }

    const existingEmployee = await Employee.findOne({ userId });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "⚠️ Employee profile already exists for this user." });
    }

    const newEmployee = new Employee({ ...req.body, userId });
    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "✅ Employee profile created successfully.",
      employee: newEmployee,
    });

  } catch (error) {
    console.error("🔥 Error in addEmployee:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Internal Server Error while adding employee.",
      error: error.message
    });
  }
};

// ✅ Get Profile for Logged-in User
exports.getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employee = await Employee.findOne({ userId }).select('-__v');

    if (!employee) {
      return res.status(404).json({ success: false, message: '❌ Employee not found for this user.' });
    }

    return res.status(200).json({
      success: true,
      employee
    });

  } catch (error) {
    console.error("❌ Error in getEmployeeProfile:", error);
    return res.status(500).json({ success: false, message: '❌ Internal Server Error' });
  }
};

// ✅ Get All Employees (Admin use or public)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }).select('-__v');
    return res.status(200).json({
      success: true,
      employees
    });
  } catch (error) {
    console.error("❌ Error in getAllEmployees:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Server Error fetching all employees.",
      error: error.message
    });
  }
};

// ✅ Get Next 5 Upcoming Birthdays
// ✅ Get Next 5 Upcoming Birthdays (This Year Only)
exports.getUpcomingBirthdays = async (req, res) => {
  try {
    const employees = await Employee.find({ dateOfBirth: { $exists: true } }).select('-__v');

    const today = moment();

    const upcoming = employees
      .map(emp => {
        const dob = moment(emp.dateOfBirth);
        const nextBirthday = moment({ 
          year: today.year(), 
          month: dob.month(), 
          day: dob.date() 
        });

        // If birthday already passed this year, skip it
        if (nextBirthday.isBefore(today, 'day')) return null;

        return { ...emp.toObject(), nextBirthday };
      })
      .filter(Boolean) // remove nulls
      .sort((a, b) => a.nextBirthday - b.nextBirthday)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      upcomingBirthdays: upcoming
    });

  } catch (error) {
    console.error("❌ Error in getUpcomingBirthdays:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Server error fetching upcoming birthdays.",
      error: error.message
    });
  }
};

// ✅ Update Employee By MongoDB ID
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: '❌ Invalid employee ID format.' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: '❌ Employee not found.' });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Employee updated successfully.",
      employee: updatedEmployee
    });

  } catch (error) {
    console.error("❌ Error in updateEmployee:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Server error updating employee.",
      error: error.message
    });
  }
};
