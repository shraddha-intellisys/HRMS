const express = require('express');
const router = express.Router();
const Employee = require('../models/employeeSchema');
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Get Employee by MongoDB ID (No Auth)
router.get('/employee/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Next 5 Upcoming Birthdays (Protected)
router.get('/upcoming-birthdays', authMiddleware, employeeController.getUpcomingBirthdays);

// ✅ Add New Employee (Protected)
router.post('/add', authMiddleware, employeeController.addEmployee);

// ✅ Update Employee by ID (Protected)
router.put('/update/:id', authMiddleware, employeeController.updateEmployee);

// ✅ Get All Employees (Protected)
router.get('/all', authMiddleware, employeeController.getAllEmployees);

// ✅ Fallback: Get All Employees (for /api/employees route)
router.get('/', authMiddleware, employeeController.getAllEmployees);

// ✅ Get Profile of Logged-in Employee (Protected)
router.get('/profile', authMiddleware, employeeController.getEmployeeProfile);

router.put('/:id', async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
