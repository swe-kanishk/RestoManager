import { model, Schema } from "mongoose";

const attendanceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
  },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const AttendanceModel = model("Attendance", attendanceSchema);
export default AttendanceModel;