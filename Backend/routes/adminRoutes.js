const express = require('express');
const router = express.Router();

// Sample admin route
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;
