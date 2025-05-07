const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in environment variables!");
    process.exit(1);
}

// ✅ Signup - Register New User
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const employeeId = uuidv4(); // 🔐 Unique employeeId
        const newUser = new User({ name, email, password: hashedPassword, employeeId });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                employeeId: newUser.employeeId
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ Login - Auth & return token
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 🛡️ Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                employeeId: user.employeeId,
                username: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ Logout - Clear Token
router.post('/logout', (req, res) => {
    res.clearCookie('authToken').json({ success: true, message: "✅ Logged out successfully" });
});

module.exports = router;
