import ExpenseModel from "../models/expense.model.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export const addExpense = async (req, res) => {
  try {
    const { date, expenses } = req.body;

    if (!date || !expenses || !Array.isArray(expenses)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }

    // Parse date from frontend and normalize to start of day
    const reqDate = dayjs.utc(date).startOf("day");

    const day = reqDate.date();
    const month = reqDate.month(); // 0-indexed
    const year = reqDate.year();

    // Check for existing expense on same day (ignoring time)
    const existingExpense = await ExpenseModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$date" }, day] },
          { $eq: [{ $month: "$date" }, month + 1] }, // $month is 1-indexed
          { $eq: [{ $year: "$date" }, year] },
        ],
      },
    });

    if (existingExpense) {
      return res.status(400).json({
        success: false,
        message: "Expense for this date already exists.",
      });
    }

    const total = expenses.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    const roundedTotal = parseFloat(total.toFixed(2));

    const newExpense = new ExpenseModel({
      date: reqDate.toDate(),                     // exact date (00:00 UTC)
      day: reqDate.format("dddd"),                // weekday name (e.g., Monday)
      expenses,
      total: roundedTotal,
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      data: newExpense,
      message: "Expense added successfully!",
    });

  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const updateExpenseByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { expenses = [], income } = req.body;

    // Format the input date to start of day
    const formattedDate = dayjs(date).startOf("day").toDate();

    const existing = await ExpenseModel.findOne({ date: formattedDate });

    if (!existing) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update expenses (replace with new list if provided)
    if (expenses && Array.isArray(expenses)) {
      existing.expenses = expenses;

      // Recalculate total
      const total = expenses.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
      existing.total = parseFloat(total.toFixed(2));
    }

    // Update income if provided
    if (income !== undefined && income !== null) {
      existing.income = parseFloat(income);
    }

    // Calculate profit/loss and percentage
    if (existing.income !== undefined && existing.total !== undefined) {
      const { income, total } = existing;

      let profitOrLoss = "Break-even";
      let percentage = 0;

      if (income > total) {
        profitOrLoss = "Profit";
        percentage = ((income - total) / total) * 100;
      } else if (income < total) {
        profitOrLoss = "Loss";
        percentage = ((total - income) / total) * 100;
      }

      existing.profitOrLoss = profitOrLoss;
      existing.percentage = parseFloat(percentage.toFixed(2));
    }

    await existing.save();

    res.status(200).json({ success: true, data: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ExpenseModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "No expense found for the given date" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getExpenseByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Convert to start and end of the given day in IST
    const startOfDayIST = dayjs.tz(date, IST).startOf("day").toDate();
    const endOfDayIST = dayjs.tz(date, IST).endOf("day").toDate();

    const expense = await ExpenseModel.findOne({
      date: { $gte: startOfDayIST, $lte: endOfDayIST },
    });

    if (!expense) {
      return res.status(404).json({ message: "No data found for given date" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getLast10DaysExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const today = dayjs().endOf("day").toDate();
    const tenDaysAgo = dayjs().subtract(10, 'day').startOf("day").toDate();

    const totalCount = await ExpenseModel.countDocuments({
      date: { $gte: tenDaysAgo, $lte: today },
    });

    const expenses = await ExpenseModel.find({
      date: { $gte: tenDaysAgo, $lte: today },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      data: expenses,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const expense = await ExpenseModel.findById(id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const updateExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenses = [], income } = req.body;

    const existing = await ExpenseModel.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update expenses if provided
    if (Array.isArray(expenses) && expenses.length > 0) {
      existing.expenses = expenses;

      // Calculate total
      const total = expenses.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
      existing.total = parseFloat(total.toFixed(2));
    }

    // Update income if provided
    if (income !== undefined && income !== null) {
      existing.income = parseFloat(income);
    }

    // Recalculate profit/loss and percentage
    const { income: finalIncome = 0, total: finalTotal = 0 } = existing;

    let profitOrLoss = "Break-even";
    let percentage = 0;

    if (finalIncome > finalTotal) {
      profitOrLoss = "Profit";
      percentage = ((finalIncome - finalTotal) / finalTotal) * 100;
    } else if (finalIncome < finalTotal) {
      profitOrLoss = "Loss";
      percentage = ((finalTotal - finalIncome) / finalTotal) * 100;
    }

    existing.profitOrLoss = profitOrLoss;
    existing.percentage = parseFloat(percentage.toFixed(2));

    await existing.save();

    res.status(200).json({ success: true, data: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};