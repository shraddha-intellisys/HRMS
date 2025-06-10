import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: '⛔ Access denied: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ message: '✅ Admin login successful', token, role: admin.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createAdmin(req, res) {
  try {
    const { username, password } = req.body;

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: '⚠️ Admin already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashed, role: 'admin' });

    await admin.save();
    res.status(201).json({ message: '✅ Admin created successfully', admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getAdminDashboard = (req, res) => {
  res.status(200).json({ message: '✅ Welcome to Admin Dashboard!' });
};
