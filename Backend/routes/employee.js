const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');


// Just 1 public route — no token required
router.post('/add', employeeController.addEmployee);
router.get('/all',  employeeController.getAllEmployees);
router.get('/employee/:id', employeeController.getEmployeeById);
router.get('/latest', employeeController.getLatestEmployee);
router.get('/employee/code/:employeeCode', employeeController.getEmployeeByCode);

router.put('/update/:id', employeeController.updateEmployee);
router.get('/profile', employeeController.getEmployeeProfile);



module.exports = router;
