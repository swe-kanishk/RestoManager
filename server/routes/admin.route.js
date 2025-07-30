// routes/admin.routes.js
import express from "express";
import {
  loginAdminController,
  logoutAdminController,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdminController);
adminRouter.post("/logout", logoutAdminController);

export default adminRouter;
