const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const payslipController = require('../controllers/payslip.controller');

// Storage location:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', upload.single('payslip'), payslipController.uploadPayslip);
router.get('/', payslipController.getPayslips);

router.get('/download', payslipController.downloadPayslip);
router.get('/months', payslipController.getAvailableMonths);



module.exports = router;
