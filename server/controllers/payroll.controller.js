import AdvancePaymentModel from "../models/advancePayment.model.js";
import AttendanceModel from "../models/attendance.model.js";
import EmployeeModel from "../models/employee.model.js";
import PayrollModel from "../models/payroll.model.js";

export const createOrUpdatePayroll = async (req, res) => {
  try {
    let { employeeId, month, year, absentCutPerDay } = req.body;

    month = parseInt(month); // Ensure it's a number
    year = parseInt(year);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: "Month must be between 1 and 12" });
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const grossSalary = Number(employee.salary);
    const joinDate = new Date(employee.createdAt);
    const joinDay = joinDate.getDate();

    // Construct start and end date (month is 1-based, JS Date uses 0-based)
    const startDate = new Date(year, month - 1, joinDay);         // e.g., July 16
    const endDate = new Date(year, month, joinDay);               // e.g., August 16

    // Count Absent Days
    const absentDays = await AttendanceModel.countDocuments({
      employeeId,
      date: { $gte: startDate, $lt: endDate },
      status: "Absent",
    });
    // Calculate per-day absent cut
    const currentMonthDays = new Date(year, month, 0).getDate(); // last day of current month
    const perDayCut = absentCutPerDay || parseFloat(grossSalary / currentMonthDays);

    const absentDeduction = absentDays * perDayCut;

    // Total Advance during this payroll period
    const advances = await AdvancePaymentModel.find({
      employeeId,
      date: { $gte: startDate, $lt: endDate },
    });

    const totalAdvance = advances.reduce((sum, adv) => sum + adv.amount, 0);

    const netSalary = grossSalary - absentDeduction - totalAdvance;
    // Check existing payroll
    const existingPayroll = await PayrollModel.findOne({
      employeeId,
      month,
      year,
    });

    if (existingPayroll) {
      existingPayroll.absentDays = absentDays;
      existingPayroll.absentCutPerDay = perDayCut;
      existingPayroll.grossSalary = grossSalary;
      existingPayroll.netSalary = netSalary;

      const payroll = await existingPayroll.save();

      return res.status(200).json({
        success: true,
        message: "Payroll updated",
        payroll,
        totalAdvance
      });
    } else {
      const newPayroll = await PayrollModel.create({
        employeeId,
        month,
        year,
        absentDays,
        absentCutPerDay: perDayCut,
        grossSalary,
        netSalary,
      });

      return res.status(201).json({
        success: true,
        message: "Payroll generated",
        payroll: newPayroll,
        totalAdvance
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getEmployeePayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    if (!employeeId || !month || !year) {
      return res
        .status(400)
        .json({ message: "Employee ID, month, and year are required" });
    }

    const payroll = await PayrollModel.findOne({
      employeeId,
      month: parseInt(month),
      year: parseInt(year),
    })

    if (!payroll) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Payroll not found for the given criteria",
        });
    }

    res.status(200).json({ success: true, payroll });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
