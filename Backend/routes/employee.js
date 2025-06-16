const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const Employee = require('../models/employeeSchema');




// Just 1 public route — no token required
router.post('/add', employeeController.addEmployee);
router.get('/all',  employeeController.getAllEmployees);
router.get('/employee/:id', employeeController.getEmployeeById);
router.get('/latest', employeeController.getLatestEmployee);
router.get('/employee/code/:employeeCode', employeeController.getEmployeeByCode);

router.put('/update/:id', employeeController.updateEmployee);
router.get('/profile', employeeController.getProfile);   // ✅ only one profile route
router.get('/upcoming-birthdays', employeeController.getUpcomingBirthdays);

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching employees', error: err.message });
  }
});


module.exports = router;
