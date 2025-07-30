import dayjs from "dayjs";
import ExpenseModel from "../models/expense.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const today = dayjs().endOf("day").toDate();
    const thirtyDaysAgo = dayjs().subtract(30, "day").startOf("day").toDate();

    // Fetch last 30 days data
    const data = await ExpenseModel.find({
      date: { $gte: thirtyDaysAgo, $lte: today }
    }).sort({ date: -1 });

    // Aggregate totals
    const totalExpense = data.reduce((acc, item) => acc + (item.total || 0), 0);
    const totalIncome = data.reduce((acc, item) => acc + (item.income || 0), 0);
    const profitOrLoss = totalIncome - totalExpense;

    const percentage = totalIncome === 0 ? 0 : ((profitOrLoss / totalIncome) * 100).toFixed(2);

    let status = "Break-even";
    if (profitOrLoss > 0) status = "Profit";
    else if (profitOrLoss < 0) status = "Loss";

    res.status(200).json({
      success: true,
      data: {
        totalExpense,
        totalIncome,
        profitOrLoss,
        percentage,
        status,
        recent: data, // You can limit or format this on frontend
      }
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
