const User = require('../models/user'); // Or Admin, based on your schema

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = newPassword; // You should hash password before saving in real app
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
