const EmployeeAttendance = require('../models/EmployeeAttendance');
const User = require('../models/User');

exports.getSalaryByMonth = async (req, res) => {
  try {
    const { employeeId, year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Fetch employee details
    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Fetch attendance records for the month
    const attendanceRecords = await EmployeeAttendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate attendance metrics
    let daysPresent = 0;
    let daysAbsent = 0;

    attendanceRecords.forEach(record => {
      if (record.status === 'present') daysPresent++;
      else if (record.status === 'absent') daysAbsent++;
    });

    // Calculate salary
    let salary = (daysPresent * employee.dailyRate);


    // Response
    res.json({
      employeeId,
      employeeName: employee.username,
      year,
      month,
      daysPresent,
      daysHalfDay,
      daysAbsent,
      daysLeave,
      totalHoursWorked,
      salary,
      hourlyRate: employee.hourlyRate,
      dailyRate: employee.dailyRate,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getSalaryByYear = async (req, res) => {
  try {
    const { employeeId, year } = req.params;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Fetch employee details
    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Fetch attendance records for the year
    const attendanceRecords = await EmployeeAttendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate attendance metrics
    let daysPresent = 0;
    let daysHalfDay = 0;
    let daysAbsent = 0;
    let daysLeave = 0;
    let totalHoursWorked = 0;

    attendanceRecords.forEach(record => {
      if (record.status === 'present') daysPresent++;
      else if (record.status === 'half-day') daysHalfDay++;
      else if (record.status === 'absent') daysAbsent++;
      else if (record.status === 'leave') daysLeave++;
      totalHoursWorked += record.hoursWorked;
    });

    // Calculate salary
    let salary = 0;
    if (employee.hourlyRate > 0) {
      salary = totalHoursWorked * employee.hourlyRate;
    } else if (employee.dailyRate > 0) {
      salary = (daysPresent * employee.dailyRate) + (daysHalfDay * employee.dailyRate * 0.5);
    }

    // Response
    res.json({
      employeeId,
      employeeName: employee.username,
      year,
      daysPresent,
      daysHalfDay,
      daysAbsent,
      daysLeave,
      totalHoursWorked,
      salary,
      hourlyRate: employee.hourlyRate,
      dailyRate: employee.dailyRate,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};