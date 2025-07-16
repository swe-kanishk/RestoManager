import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addEmployeeController, editEmployeeController, getEmployees, removeEmployeeController } from "../controllers/employee.controller.js";

const employeeRouter = Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/', upload.array('avatar'), addEmployeeController);
employeeRouter.put('/:employeeId', upload.array('avatar'), editEmployeeController);
employeeRouter.delete('/:employeeId', removeEmployeeController);

export default employeeRouter;