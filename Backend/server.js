require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');


// ✅ Import Routes
const authRoutes = require('./routes/auth.Routes');
const employeeRoutes = require('./routes/employee');
const profileRoutes = require('./routes/profileRoutes');
const attendanceApplicationRoutes = require('./routes/attendanceApplicationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const resignationRoutes = require('./routes/resignationRoutes');
const Resignation = require('./models/Resignation');
const adminRoutes = require('./routes/adminRoutes');
const payslipRoutes = require('./routes/payslip.routes');
const adminDashboardRoutes = require('./routes/adminDashboard');
const holidayRoutes = require('./routes/holidayRoutes');





const UserModel = require('./models/user'); // for employee info by employeeId

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

console.log(`🌍 Connecting to MongoDB at: ${DB_URI}`);

// ✅ Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));


// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', attendanceApplicationRoutes);
app.use('/uploads', express.static('uploads'));


app.use('/api', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/resignation', resignationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payslips', require('./routes/payslip.routes'));
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/holidays', holidayRoutes);



// ✅ MongoDB Connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
});

mongoose.connection.on('connected', () => console.log('✅ MongoDB connected successfully'));
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

// ✅ Test API Route
app.post('/api/resignation/submit', async (req, res) => {
  try {
    const resignation = new Resignation(req.body);
    await resignation.save();
    res.status(200).json({ message: 'Resignation submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving resignation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




// ✅ Debug: Create User Manually (if needed)
app.post('/api/employees/create', async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: '❌ Missing required fields' });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: '⚠️ User already exists' });
    }

    const newUser = new UserModel(req.body);
    await newUser.save();

    res.status(201).json({ success: true, message: '✅ User created successfully!', user: newUser });
  } catch (error) {
    console.error("🔥 Error creating user:", error);
    res.status(500).json({ success: false, message: '❌ Internal server error', error: error.message });
  }
});

// ✅ Debug: Get Employee Profile By employeeId
app.get('/api/employees/profile/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await UserModel.findOne({ employeeId }).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: '⚠️ Employee not found' });
    }

    res.status(200).json({ success: true, employee: user });
  } catch (error) {
    console.error("🔥 Error fetching employee profile:", error);
    res.status(500).json({ success: false, message: '❌ Internal server error', error: error.message });
  }
});



// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.message, err.stack);
  res.status(500).json({ message: '❌ Internal server error', error: err.message });
});

// ✅ Graceful Shutdown
const shutdown = () => {
  console.log('🔻 Shutting down server...');
  mongoose.connection.close(() => {
    console.log('📴 MongoDB connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ✅ Crash Protection
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Promise Rejection:', reason);
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

(async () => {
  try {
    const admins = [
      {
        username: 'rutik',
        email: 'rutik@gmail.com',
        password: 'Rutik@123',
        empID: 'ADM001',
        userID: 'R001',
        role: 'admin'
      },
      {
        username: 'mahesh',
        email: 'mahesh@gmail.com',
        password: 'Mahesh@123',
        empID: 'ADM002',
        userID: 'M002',
        role: 'admin'
      },
      {
        username: 'swapnil',
        email: 'swapnil@gmail.com',
        password: 'Swapnil@123',
        empID: 'ADM003',
        userID: 'S003',
        role: 'admin'
      }
    ];

    for (const adminData of admins) {
      const existingAdmin = await UserModel.findOne({ username: adminData.username });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const newAdmin = new UserModel({
          username: adminData.username,
          email: adminData.email,
          password: hashedPassword,
          empID: adminData.empID,
          userID: adminData.userID,
          role: adminData.role
        });

        await newAdmin.save();
        console.log(`✅ Default admin created: ${adminData.username} / ${adminData.password}`);
      } else {
        console.log(`⚠️ Default admin already exists: ${adminData.username}`);
      }
    }
  } catch (err) {
    console.error('❌ Failed to seed default admins:', err.message);
  }
})();


