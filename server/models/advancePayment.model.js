// models/AdvancePayment.js
import { Schema, model } from "mongoose";

const advancePaymentSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const AdvancePaymentModel = model("AdvancePayment", advancePaymentSchema);
export default AdvancePaymentModel;
