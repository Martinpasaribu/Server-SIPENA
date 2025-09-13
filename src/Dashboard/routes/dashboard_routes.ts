import express, { Request, Response, NextFunction } from "express";
import { DashboardControllers } from "../controllers/dashboard_controllers";

const DashboardRouter: express.Router = express.Router();


// semantic meaning

// Auth

DashboardRouter.get("/", DashboardControllers.GetInfo);
DashboardRouter.get("/report-status-pie", DashboardControllers.GetReportStatusStats);

// DashboardRouter.post("/", FacilityControllers.PostFacility);
// DashboardRouter.delete("/:id", FacilityControllers.DeleteFacility);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me);


export default DashboardRouter;
