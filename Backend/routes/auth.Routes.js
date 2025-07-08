const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username/Email and password are required" });
        }

        // 1. Try admin login (users collection, by username)
        const User = require('../models/user');
        let user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            // Admin login
            const token = jwt.sign({
                userId: user._id,
                username: user.username,
                role: 'admin'
            }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({
                success: true,
                token,
                userId: user._id,
                username: user.username,
                role: 'admin'
            });
        }

        // 2. Try employee login (employees collection, by email)
        const Employee = require('../models/employeeSchema');
        let employee = await Employee.findOne({ email: username });
        if (employee && await bcrypt.compare(password, employee.password)) {
            const token = jwt.sign({
                userId: employee._id,
                employeeId: employee.employeeCode,
                email: employee.email,
                role: 'employee'
            }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({
                success: true,
                token,
                userId: employee._id,
                employeeId: employee.employeeCode,
                email: employee.email,
                username: employee.name,
                role: 'employee'
            });
        }

        // 3. If neither found
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
});

module.exports = router;