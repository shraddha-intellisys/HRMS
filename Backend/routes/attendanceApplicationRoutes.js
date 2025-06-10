const express = require('express');
const router = express.Router();
const {
  submitAttendance
} = require('../controllers/attendanceApplicationController');
const attendanceController = require('../controllers/attendanceApplicationController');
const controller = require('../controllers/attendanceApplicationController');


router.post('/attendance-application', controller.submitAttendance);        
router.post('/cancel', attendanceController.cancelApplication);            
router.get('/pbm', controller.getPBMAttendance);
router.get('/all', controller.getAllAttendance);
router.get('/attendance-application/pending', controller.getPendingApplications);

router.get('/approved', controller.getAllAttendance);
router.put('/attendance-application/approve', controller.approveApplication);

router.put('/reject', controller.rejectApplication);

module.exports = router;
