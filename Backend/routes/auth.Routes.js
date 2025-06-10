const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const empID = uuidv4();
        const userID = uuidv4();

        const newUser = new User({ username, email, password: hashedPassword, empID, userID, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", empID, userID });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {
                userId: user._id,
                employeeId: user.empID,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            token,
            userId: user._id,
            employeeId: user.empID,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

module.exports = router;