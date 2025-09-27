import express, { Request, Response, NextFunction } from "express";
import { EmployeeController } from "../controllers/employee_controllers";
import { verifyAdmin } from "../../middleware/VerifyAdminId";


const EmployeeRouter: express.Router = express.Router();




// semantic meaning


EmployeeRouter.get("/", EmployeeController.GetEmployee)
EmployeeRouter.get("/facility-on-division/:id", EmployeeController.GetIFacilityOnDivisionEmployee)
EmployeeRouter.post("/", verifyAdmin, EmployeeController.CreateEmployee)
EmployeeRouter.put("/:_id", EmployeeController.UpdateEmployee);
EmployeeRouter.put("/status/:_id", EmployeeController.UpdateEmployeeStatus);
EmployeeRouter.delete("/:_id", EmployeeController.DeletedEmployee);
EmployeeRouter.patch("/update/:_id", EmployeeController.UpdateEmployeeClient);


export default EmployeeRouter;
