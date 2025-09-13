"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_controllers_1 = require("../controllers/employee_controllers");
const EmployeeRouter = express_1.default.Router();
// semantic meaning
EmployeeRouter.get("/", employee_controllers_1.EmployeeController.GetEmployee);
EmployeeRouter.post("/", employee_controllers_1.EmployeeController.CreateEmployee);
EmployeeRouter.put("/:_id", employee_controllers_1.EmployeeController.UpdateEmployee);
EmployeeRouter.put("/status/:_id", employee_controllers_1.EmployeeController.UpdateEmployeeStatus);
EmployeeRouter.delete("/:_id", employee_controllers_1.EmployeeController.DeletedEmployee);
exports.default = EmployeeRouter;
