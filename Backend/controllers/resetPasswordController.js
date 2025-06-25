const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Basic validation
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: '✅ Password reset successful.' });
  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
