const AdminDashboard = require('../models/AdminDashboard');

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    let dashboard = await AdminDashboard.findOne();
    if (!dashboard) {
      dashboard = new AdminDashboard();
      await dashboard.save();
    }
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update dashboard data
exports.updateDashboard = async (req, res) => {
  try {
    const update = req.body;
    let dashboard = await AdminDashboard.findOne();

    if (!dashboard) {
      dashboard = new AdminDashboard(update);
    } else {
      Object.assign(dashboard, update);
    }

    await dashboard.save();
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
