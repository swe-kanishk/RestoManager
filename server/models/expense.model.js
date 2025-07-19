import { model, Schema } from "mongoose";

const expenseSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  expenses: [
    {
      itemName: { type: String, required: true },
      qty: { type: String },
      price: { type: Number, required: true },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  income: {
    type: Number, // Income added later
    default: 0,
  },
  profitOrLoss: {
    type: String, // "Profit", "Loss", "Break-even"
  },
  percentage: {
    type: Number, // Profit or loss percentage
  },
}, {timestamps: true});

const ExpenseModel = model('Expense', expenseSchema);
export default ExpenseModel;