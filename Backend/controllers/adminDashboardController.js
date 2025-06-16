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
    console.log("Received payload:", JSON.stringify(update, null, 2));  // FULL LOG

    let dashboard = await AdminDashboard.findOne();

    if (!dashboard) {
      dashboard = new AdminDashboard(update);
    } else {
      Object.assign(dashboard, update);
    }

    await dashboard.save();
    res.json(dashboard);
  } catch (err) {
    console.error("🔥 Error while updating dashboard:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateDashboard = async (req, res) => {
  try {
    let dashboard = await AdminDashboard.findOne();

    if (!dashboard) {
      dashboard = new AdminDashboard(req.body);
    } else {
      Object.assign(dashboard, req.body);
    }

    await dashboard.save();

    res.json({ success: true, dashboard });
  } catch (err) {
    console.error("Error updating dashboard:", err);
    res.status(500).json({ success: false, message: 'Failed to update dashboard', error: err.message });
  }
};

// ✅ User/Home: fetch dashboard data (public endpoint)
exports.getDashboardPublic = async (req, res) => {
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