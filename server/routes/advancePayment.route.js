// routes/advanceRoutes.js
import express from "express";
import {
  createAdvancePayment,
  getAdvancePayments,
  updateAdvancePayment,
  deleteAdvancePayment,
} from "../controllers/advancePayment.controller.js";

const advancePaymentRouter = express.Router();

advancePaymentRouter.post("/", createAdvancePayment);
advancePaymentRouter.get("/:employeeId/:month/:year", getAdvancePayments);
// advancePaymentRouter.put("/:id", updateAdvancePayment);
advancePaymentRouter.delete("/:id", deleteAdvancePayment);

export default advancePaymentRouter;

