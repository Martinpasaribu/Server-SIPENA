"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_admin_1 = require("../controller/controller_admin");
const VerifyAdminId_1 = require("../../middleware/VerifyAdminId");
const AdminRouter = express_1.default.Router();
// semantic meaning
// User
AdminRouter.get("/getUser", controller_admin_1.AdminController.getUser);
AdminRouter.get("/", controller_admin_1.AdminController.GetAllAdmin);
AdminRouter.post("/register", VerifyAdminId_1.verifyAdmin, controller_admin_1.AdminController.Register);
AdminRouter.patch("/update/:_id", controller_admin_1.AdminController.UpdateAdmin);
AdminRouter.patch("/update-role/:_id", controller_admin_1.AdminController.UpdateRole);
exports.default = AdminRouter;
