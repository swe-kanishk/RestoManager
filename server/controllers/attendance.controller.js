import AttendanceModel from "../models/attendance.model.js";
import EmployeeModel from "../models/employee.model.js";
import dayjs from "dayjs";

export const markOrUpdateAttendance = async (req, res) => {
  const { employeeId, date, status } = req.body;

  if (!employeeId || !date || !status) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // Fetch the employee
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const attendanceDate = dayjs(date).startOf('day');
    const joiningDate = dayjs(employee.createdAt).startOf('day');

    // Allow attendance only on or after joining date
    if (attendanceDate.isBefore(joiningDate)) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark attendance before employee's joining date",
      });
    }

    const existing = await AttendanceModel.findOne({ employeeId, date });

    if (existing) {
      existing.status = status;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated",
        data: existing,
      });
    }

    const attendance = new AttendanceModel({
      employeeId,
      date,
      status,
    });

    await attendance.save();

    return res.status(201).json({
      success: true,
      message: "Attendance marked",
      data: attendance,
    });
  } catch (error) {
    console.error("Error in markOrUpdateAttendance:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/attendanceController.js
export const getMonthlyAttendance = async (req, res) => {
  const { employeeId, month, year } = req.query; // ✅ Corrected

  console.log(employeeId, month, year); // Now this will show actual values

  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const attendance = await AttendanceModel.find({
      employeeId,
      date: { $gte: startDate, $lt: endDate },
    });

    const presentDays = attendance.filter((a) => a.status === "Present").length;
    const absentDays = attendance.filter((a) => a.status === "Absent").length;

    res.status(200).json({
      success: true,
      totalDays: attendance.length,
      presentDays,
      absentDays,
      records: attendance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching report" });
  }
};


