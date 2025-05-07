const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // ✅ User Model
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // ✅ UUID for empID and userID

// ✅ Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in environment variables!");
    process.exit(1);
}

// ✅ Signup - Register New User
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 🔍 Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🆔 Generate Employee ID and User ID
        const empID = uuidv4();
        const userID = uuidv4();

        // 💾 Save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            empID,
            userID
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "✅ User registered successfully!",
            empID,
            userID
        });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ success: false, message: "Signup failed.", error: error.message });
    }
});

// ✅ Login - Authenticate User
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 🔍 Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: "❌ User not found" });
        }

        // 🔑 Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "❌ Invalid credentials" });
        }

        // 🎫 Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                employeeId: user.empID,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            token,
            userId: user._id,
            employeeId: user.empID,
            username: user.username
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "❌ Server error", error: error.message });
    }
});

// ✅ Logout - Clear Token (if used in cookies)
router.post('/logout', (req, res) => {
    res.clearCookie('authToken')
        .json({ success: true, message: "✅ Logged out successfully" });
});

// ✅ Export router
module.exports = router;
