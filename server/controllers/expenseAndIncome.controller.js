
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import ExpenseModel from "../models/expense.model.js";

// CREATE Expense
export const createExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;
  try {
    const newExpense = new ExpenseModel({ amount, category, description, date });
    await newExpense.save();
    res.status(201).json({ success: true, message: "Expense created", data: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating expense", error });
  }
};

// READ - Get All Expenses (optionally filter by day, month, year)
export const getExpenses = async (req, res) => {
  const { type, date } = req.query;
  let filter = {};

  try {
    if (type && date) {
      const refDate = new Date(date);
      if (type === "daily") {
        filter.date = { $gte: startOfDay(refDate), $lte: endOfDay(refDate) };
      } else if (type === "monthly") {
        filter.date = { $gte: startOfMonth(refDate), $lte: endOfMonth(refDate) };
      } else if (type === "yearly") {
        filter.date = { $gte: startOfYear(refDate), $lte: endOfYear(refDate) };
      }
    }

    const expenses = await ExpenseModel.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching expenses", error });
  }
};

// READ - Get One Expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching expense", error });
  }
};

// UPDATE
export const updateExpense = async (req, res) => {
  try {
    const updated = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating expense", error });
  }
};