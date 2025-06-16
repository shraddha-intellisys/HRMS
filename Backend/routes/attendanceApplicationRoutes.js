const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceApplicationController');

router.post('/attendance-application', controller.submitAttendance);
router.get('/attendance-application/pending', controller.getPendingApplications);
router.get('/attendance-application/approved', controller.getApprovedAttendanceApplications);
router.put('/attendance-application/approve', controller.approveApplication);
router.put('/attendance-application/reject', controller.rejectApplication);

module.exports = router;
