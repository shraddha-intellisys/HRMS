const Attendance = require('../models/Attendance');
const moment = require('moment');

exports.markIn = async (req, res) => {
  const { employeeCode } = req.body;
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('hh:mm:ss A');

  let record = await Attendance.findOne({ employeeCode, date });
  if (!record) {
    record = new Attendance({ employeeCode, date, markInTime: time });
  } else {
    record.markInTime = time;
  }

  await record.save();
  res.status(200).json({ message: 'Mark In saved', markInTime: time });
};

exports.markOut = async (req, res) => {
  const { employeeCode } = req.body;
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('hh:mm:ss A');

  const record = await Attendance.findOne({ employeeCode, date });
  if (!record || !record.markInTime) {
    return res.status(400).json({ message: 'Mark In required first' });
  }

  record.markOutTime = time;
  await record.save();
  res.status(200).json({ message: 'Mark Out saved', markOutTime: time });
};

exports.getAttendanceByEmployee = async (req, res) => {
  const { employeeCode } = req.params;
  const records = await Attendance.find({ employeeCode });
  res.status(200).json(records);
};
