
import dayjs from "dayjs";
import ExpenseModel from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { date, expenses } = req.body;

    // Convert date from request and current date to start of day
    const reqDate = dayjs(date).startOf("day").toDate();
    const today = dayjs().startOf("day").toDate();

    // Validate date is today
    if (!dayjs(date).isSame(dayjs(), 'day')) {
      return res.status(400).json({ message: "You can only add expenses for today's date." });
    }

    // Check if an entry already exists for today's date (ignoring time)
    const alreadyExists = await ExpenseModel.findOne({
      date: {
        $gte: dayjs(reqDate).startOf("day").toDate(),
        $lte: dayjs(reqDate).endOf("day").toDate(),
      }
    });

    if (alreadyExists) {
      return res.status(400).json({ message: "Budget for today already exists." });
    }

    // Calculate total expense
    const total = expenses.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const roundedTotal = parseFloat(total.toFixed(2));

    // Get day name (e.g., Monday, Tuesday)
    const day = dayjs(reqDate).format("dddd");

    // Save entry
    const newExpense = new ExpenseModel({
      date: reqDate,
      day,
      expenses,
      total: roundedTotal,
    });

    await newExpense.save();
    res.status(201).json({ success: true, data: newExpense });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
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
      const total = expenses.reduce((sum, item) => sum + parseFloat(item.price), 0);
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
    if (!deleted) return res.status(404).json({ message: "No expense found for the given date" });

    res.status(200).json({ success: true, message: "Deleted successfully"});
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getExpenseByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const formattedDate = dayjs(date).startOf("day").toDate();

    const expense = await ExpenseModel.findOne({ date: formattedDate });
    if (!expense) return res.status(404).json({ message: "No data found for given date" });

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getLast10DaysExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
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
