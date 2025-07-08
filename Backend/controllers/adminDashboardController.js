const AdminDashboard = require('../models/AdminDashboard');
const Notification = require('../models/Notification');

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

exports.updateDashboard = async (req, res) => {
  try {
    const update = req.body;
    let dashboard = await AdminDashboard.findOne();

    if (!dashboard) {
      dashboard = new AdminDashboard(update);
      await dashboard.save();
    } else {
      // 📌 Notify for each section

      // 🔔 Reminders
      const oldReminders = dashboard.reminders || [];
      const newReminders = update.reminders || [];
      if (newReminders.length > oldReminders.length) {
        const added = newReminders.slice(oldReminders.length);
        for (const reminder of added) {
          await Notification.create({
            recipient: 'all',
            title: 'New Reminder Added',
            message: `Admin added a reminder: "${reminder.title}"`,
            source: 'reminders',
            createdAt: new Date(),
          });
        }
      }

      // 🔔 News
      const oldNews = dashboard.newsItems || [];
      const newNews = update.newsItems || [];
      if (newNews.length > oldNews.length) {
        const added = newNews.slice(oldNews.length);
        for (const news of added) {
          await Notification.create({
            recipient: 'all',
            title: 'News Updated',
            message: `Admin posted in News: "${news}"`,
            source: 'newsItems',
            createdAt: new Date(),
          });
        }
      }

      // 🔔 To-Dos
      const oldTodos = dashboard.todoItems || [];
      const newTodos = update.todoItems || [];
      if (newTodos.length > oldTodos.length) {
        const added = newTodos.slice(oldTodos.length);
        for (const todo of added) {
          await Notification.create({
            recipient: 'all',
            title: 'New To-Do Added',
            message: `Admin added a task: "${todo.task}"`,
            source: 'todoItems',
            createdAt: new Date(),
          });
        }
      }

      // 🔔 Feed Items
      const oldFeeds = dashboard.feedItems || [];
      const newFeeds = update.feedItems || [];
      if (newFeeds.length > oldFeeds.length) {
        const added = newFeeds.slice(oldFeeds.length);
        for (const feed of added) {
          const feedText = typeof feed === 'string' ? feed : feed.text;
          await Notification.create({
            recipient: 'all',
            title: 'Feed Updated',
            message: `Admin added a feed: "${feedText}"`,
            source: 'feedItems',
            createdAt: new Date(),
          });
        }
      }

      // 🔔 Emp Docs
      const oldDocs = dashboard.empDocuments || [];
      const newDocs = update.empDocuments || [];
      if (newDocs.length > oldDocs.length) {
        const added = newDocs.slice(oldDocs.length);
        for (const doc of added) {
          await Notification.create({
            recipient: 'all',
            title: 'New Document',
            message: `Uploaded: "${doc.name}"`,
            source: 'empDocuments',
            createdAt: new Date(),
          });
        }
      }

      // 🔔 New Joinees
      const oldJoinees = dashboard.newJoinees || [];
      const newJoinees = update.newJoinees || [];
      if (newJoinees.length > oldJoinees.length) {
        const added = newJoinees.slice(oldJoinees.length);
        for (const j of added) {
          await Notification.create({
            recipient: 'all',
            title: 'New Joiner',
            message: `${j.name} joined on ${j.joinDate}`,
            source: 'newJoinees',
            createdAt: new Date(),
          });
        }
      }

      // 🛠️ Apply update
      Object.assign(dashboard, update);
      await dashboard.save();
    }

    res.json({ success: true, dashboard });
  } catch (err) {
    console.error("🔥 Error updating dashboard:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


