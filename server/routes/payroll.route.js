// routes/payrollRoutes.js
import express from "express";
import {
  createOrUpdatePayroll,
  getEmployeePayroll
} from "../controllers/payroll.controller.js";

const payrollRouter = express.Router();

payrollRouter.post("/", createOrUpdatePayroll);
payrollRouter.get('/:employeeId/:month/:year', getEmployeePayroll);

export default payrollRouter;
