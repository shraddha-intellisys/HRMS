const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/resetPassword'); 

router.post('/', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
