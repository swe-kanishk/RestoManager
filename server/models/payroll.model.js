import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  absentDays: {
    type: Number,
    default: 0,
  },
  absentCutPerDay: {
    type: Number,
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const PayrollModel = mongoose.model("Payroll", payrollSchema);
export default PayrollModel;
