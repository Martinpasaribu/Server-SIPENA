import express, { Request, Response, NextFunction } from "express";
import { DivisionControllers } from "../controller/controller_division";


const DivisionRoute: express.Router = express.Router();


// semantic meaning

DivisionRoute.get("/", DivisionControllers.GetDivision)
DivisionRoute.post("/", DivisionControllers.CreateDivision)
DivisionRoute.get("/code", DivisionControllers.GetCodeDivision);
DivisionRoute.put("/status/:_id", DivisionControllers.UpdateDivisionStatus);
DivisionRoute.patch("/:_id", DivisionControllers.UpdateDivision);
DivisionRoute.delete("/:_id", DivisionControllers.DeletedDivision);





export default DivisionRoute;
