import {Router} from 'express';
import {
  addExpense,
  updateExpenseByDate,
  deleteExpense,
  getExpenseByDate,
  getLast10DaysExpenses
} from '../controllers/expenseAndIncome.controller.js';

const expenseRouter = Router();

expenseRouter.get("/", getLast10DaysExpenses);
expenseRouter.post("/", addExpense);
expenseRouter.put("/:date", updateExpenseByDate);
expenseRouter.delete("/:id", deleteExpense);
expenseRouter.get("/:date", getExpenseByDate);

export default expenseRouter;
