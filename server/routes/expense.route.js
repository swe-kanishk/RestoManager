import express from 'express';
import * as expenseController from '../controllers/expenseAndIncome.controller.js';

const expenseRouter = express.Router();

// expenseRouter.post('/', expenseController.addExpense);
// expenseRouter.get('/:date', expenseController.getExpensesByDate);
// expenseRouter.get('/month/:year/:month', expenseController.getExpensesByMonth);

export default expenseRouter;
