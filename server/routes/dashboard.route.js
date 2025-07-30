// routes/advanceRoutes.js
import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;

