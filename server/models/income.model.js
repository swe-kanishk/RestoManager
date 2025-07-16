import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  source: { type: String }, // e.g., 'dine-in', 'online', etc.
  description: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Income", IncomeSchema);