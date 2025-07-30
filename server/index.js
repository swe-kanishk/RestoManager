import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/connectDb.js";
import employeeRouter from "./routes/employee.route.js";
import expenseRouter from "./routes/expense.route.js";
import employeeAttendanceRouter from "./routes/employeeAttendance.route.js";
import payrollRouter from "./routes/payroll.route.js";
import advancePaymentRouter from "./routes/advancePayment.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 3000;

app.use("/api/employee", employeeRouter);
app.use("/api/attendance", employeeAttendanceRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/advance', advancePaymentRouter);
app.use('/api/dashboard', dashboardRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
  });
});
