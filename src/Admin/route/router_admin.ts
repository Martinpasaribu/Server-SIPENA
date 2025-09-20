import express, { Request, Response, NextFunction } from "express";
import { AdminController } from "../controller/controller_admin";


const AdminRouter: express.Router = express.Router();




// semantic meaning

// User

AdminRouter.get("/getUser", AdminController.getUser)
AdminRouter.get("/", AdminController.GetAllAdmin)
AdminRouter.post("/register", AdminController.Register)
AdminRouter.patch("/update/:_id", AdminController.UpdateAdmin)
AdminRouter.patch("/update-role/:_id", AdminController.UpdateRole)




export default AdminRouter;
