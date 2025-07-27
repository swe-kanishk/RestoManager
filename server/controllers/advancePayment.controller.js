import mongoose from "mongoose";
import EmployeeModel from "../models/employee.model.js";
import AdvancePaymentModel from "../models/advancePayment.model.js";

// Create Advance Payment
export const createAdvancePayment = async (req, res) => {
  try {
    const { employeeId, amount, date } = req.body;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const paymentDate = date ? new Date(date) : new Date();

    const month = `${paymentDate.getFullYear()}-${String(
      paymentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const year = paymentDate.getFullYear();

    const advance = await AdvancePaymentModel.create({
      employeeId,
      amount,
      date: paymentDate,
      month,
      year,
    });

    res.status(201).json({ success: true, advance });
  } catch (err) {
    console.error("Create Advance Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all advances for an employee in a given month and year
export const getAdvancePayments = async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    // Step 1: Fetch employee to get joining date
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const joiningDate = new Date(employee.createdAt);
    const joiningDay = joiningDate.getDate(); // e.g. 16

    // Step 2: Define custom start and end based on joining day
    const startDate = new Date(year, month - 1, joiningDay); // e.g. July 16
    const endDate = new Date(year, month, joiningDay);       // e.g. August 16

    // Step 3: Query advance payments in this custom cycle
    const advances = await AdvancePaymentModel.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: 1 });

    res.status(200).json({ success: true, advances });
  } catch (err) {
    console.error("Get Advances Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update an advance payment
export const updateAdvancePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    const updated = await AdvancePaymentModel.findByIdAndUpdate(
      id,
      { amount, date },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Advance not found" });
    }

    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error("Update Advance Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete an advance payment
export const deleteAdvancePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AdvancePaymentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Advance not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Advance Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};