import express, { Request, Response, NextFunction } from "express";
import { EmployeeController } from "../controllers/employee_controllers";


const EmployeeRouter: express.Router = express.Router();




// semantic meaning


EmployeeRouter.get("/", EmployeeController.GetEmployee)
EmployeeRouter.post("/", EmployeeController.CreateEmployee)
EmployeeRouter.put("/:_id", EmployeeController.UpdateEmployee);
EmployeeRouter.put("/status/:_id", EmployeeController.UpdateEmployeeStatus);
EmployeeRouter.delete("/:_id", EmployeeController.DeletedEmployee);


export default EmployeeRouter;
