"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controllers_1 = require("../controllers/dashboard_controllers");
const DashboardRouter = express_1.default.Router();
// semantic meaning
// Auth
DashboardRouter.get("/", dashboard_controllers_1.DashboardControllers.GetInfo);
DashboardRouter.get("/report-status-pie", dashboard_controllers_1.DashboardControllers.GetReportStatusStats);
// DashboardRouter.post("/", FacilityControllers.PostFacility);
// DashboardRouter.delete("/:id", FacilityControllers.DeleteFacility);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me);
exports.default = DashboardRouter;
