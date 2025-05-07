const express = require('express');
const router = express.Router();
const Employee = require('../models/employeeSchema');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Get Employee Profile for Logged-in User (Based on employeeCode in token)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const employeeCode = req.user.employeeId; // assuming employeeId in token refers to employeeCode

    if (!employeeCode) {
      return res.status(400).json({
        success: false,
        message: '❌ employeeCode not found in token',
      });
    }

    const employee = await Employee.findOne({ employeeCode }).select('-__v');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Employee not found!',
      });
    }

    console.log("✅ Employee Profile Retrieved:", employee);
    return res.status(200).json({
      success: true,
      employee,
    });

  } catch (error) {
    console.error('🔥 Error retrieving employee profile:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;
