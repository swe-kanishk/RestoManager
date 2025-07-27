import AdvancePaymentModel from "../models/advancePayment.model.js";
import AttendanceModel from "../models/attendance.model.js";
import EmployeeModel from "../models/employee.model.js";
import PayrollModel from "../models/payroll.model.js";

export const createOrUpdatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, absentCutPerDay } = req.body;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Extract join day from createdAt
    const grossSalary = employee.salary;
    const joinDate = new Date(employee.createdAt);
    const joinDay = joinDate.getDate(); // just the day (e.g., 16)

    // Build start and end of payroll period
    const startDate = new Date(year, month, joinDay); // given month
    const endDate = new Date(year, month + 1, joinDay); // next month same date
    console.log(startDate, "\n", endDate);
    // Count number of days marked absent in AttendanceModel
    const absentDays = await AttendanceModel.countDocuments({
      employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "Absent", // make sure this matches your DB status field
    });

    // Calculate absent cut per day if not provided
    const daysInMonth = new Date(year, month, 0).getDate(); // total days in current month
    const perDayCut = absentCutPerDay ?? Math.round(grossSalary / daysInMonth);

    // Total absent deduction
    const absentDeduction = absentDays * perDayCut;

    // Find total advance taken in this period
    const advances = await AdvancePaymentModel.find({
      employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalAdvance = advances.reduce((sum, adv) => sum + adv.amount, 0);

    const netSalary = grossSalary - absentDeduction - totalAdvance;

    // Check if payroll already exists
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

      await existingPayroll.save();

      return res.status(200).json({
        message: "Payroll updated",
        absentDays,
        totalAdvance,
        absentDeduction,
        netSalary,
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
        message: "Payroll generated",
        absentDays,
        totalAdvance,
        absentDeduction,
        netSalary,
        payroll: newPayroll,
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
      month: parseInt(month)-1,
      year: parseInt(year),
    }).populate("employeeId");

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
