const Employee = require('../models/employeeSchema');

exports.addEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmployee
    });

  } catch (err) {
    console.error('Error while adding employee:', err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLatestEmployee = async (req, res) => {
  try {
    const latestEmployee = await Employee.findOne().sort({ _id: -1 }).limit(1);
    
    if (!latestEmployee) {
      return res.status(404).json({ message: 'No employee found' });
    }
    
    res.json(latestEmployee);
  } catch (err) {
    console.error('Error fetching latest employee:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ✅ Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID missing' });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ employee });
  } catch (err) {
    console.error("Error fetching employee profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET by employeeCode

exports.getEmployeeByCode = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const employee = await Employee.findOne({ employeeCode });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee by code:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
