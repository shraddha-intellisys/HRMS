const Payslip = require('../models/payslip');  
const path = require('path');  
const fs = require('fs');      

exports.uploadPayslip = async (req, res) => {
  try {
    const { empId, month } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const payslip = new Payslip({
      empId,
      month,
      filePath: req.file.path
    });

    await payslip.save();

    res.status(201).json({ message: 'Payslip uploaded successfully', payslip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading payslip', error: error.message });
  }
};

exports.getPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find();
    res.json(payslips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payslips', error: error.message });
  }
};

exports.downloadPayslip = async (req, res) => {
  try {
    const { empId, month } = req.query;

    if (!empId || !month) {
      return res.status(400).json({ message: 'Employee ID and month are required.' });
    }

    // Search payslip in DB
    const payslip = await Payslip.findOne({ empId, month });

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found.' });
    }

    // Build absolute file path
    const filePath = path.join(__dirname, '..', payslip.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Payslip file not found on server.' });
    }

    // Send file for download
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error downloading file.' });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAvailableMonths = async (req, res) => {
  try {
    const { empId } = req.query;
    const payslips = await Payslip.find({ empId }).select('month');
    const months = payslips.map(p => p.month);
    res.json({ months });
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).json({ message: 'Error fetching months', error: error.message });
  }
};
