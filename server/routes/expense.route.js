import {Router} from 'express';
import {
  addExpense,
  deleteExpense,
  getExpenseByDate,
  getLast10DaysExpenses,
  getExpenseById,
  updateExpenseById
} from '../controllers/expenseAndIncome.controller.js';

const expenseRouter = Router();

expenseRouter.get("/", getLast10DaysExpenses);
expenseRouter.get("/:id", getExpenseById);
expenseRouter.post("/", addExpense);
expenseRouter.put("/:id", updateExpenseById);
expenseRouter.delete("/:id", deleteExpense);
expenseRouter.get("/:date", getExpenseByDate);

export default expenseRouter;
