import { Router } from "express";
import { getMonthlyAttendance, markOrUpdateAttendance } from "../controllers/attendance.controller.js";

const employeeAttendanceRouter = Router();

employeeAttendanceRouter.post('/', markOrUpdateAttendance);
employeeAttendanceRouter.get('/', getMonthlyAttendance);
// employeeAttendanceRouter.put('/:employeeId', upload.array('avatar'), editEmployeeController);
// employeeAttendanceRouter.delete('/:employeeId', removeEmployeeController);

export default employeeAttendanceRouter;