const mongoose = require('mongoose');
const User = require('./models/user.model'); // Adjust as per your project
const Employee = require('./models/employee.model'); // Adjust as per your project
require('dotenv').config();

// 🔗 MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const updateUsersWithEmployeeId = async () => {
  try {
    const usersWithoutEmployee = await User.find({ employeeId: { $in: [null, undefined] } });

    if (!usersWithoutEmployee.length) {
      console.log('ℹ️ All users already have employee IDs.');
      return;
    }

    for (const user of usersWithoutEmployee) {
      // ✨ Customize employee fields if needed
      const newEmployee = new Employee({
        name: user.name,
        email: user.email,
        userId: user._id // Optional: link back to user
      });

      await newEmployee.save();

      // Link employeeId to user
      user.employeeId = newEmployee._id;
      await user.save();

      console.log(`✅ Linked employeeId ${newEmployee._id} to user ${user.username}`);
    }

    console.log('🎉 All users updated successfully!');
  } catch (error) {
    console.error('❌ Error updating users with employeeId:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed.');
  }
};

// 🚀 Run the function
updateUsersWithEmployeeId();
