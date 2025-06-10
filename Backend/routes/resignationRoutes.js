const express = require('express');
const router = express.Router();
const controller = require('../controllers/resignationController');

router.post('/submit', controller.submitResignation);
router.get('/pending', controller.getPendingResignations);
router.put('/approve', controller.approveResignation);
router.put('/reject', controller.rejectResignation);

module.exports = router;
