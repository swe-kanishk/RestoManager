import { model, Schema } from "mongoose";

const expenseSchema = new Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
}, {timestamps: true});

const ExpenseModel = model('Expense', expenseSchema);
export default ExpenseModel;