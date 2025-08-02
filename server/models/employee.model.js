import { model, Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Provide fullName!"],
    },
    avatar: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      required: [true, "Enter Employee Salary"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
    },
  },
  { timestamps: true }
);

const EmployeeModel = model("Employee", employeeSchema);
export default EmployeeModel;
