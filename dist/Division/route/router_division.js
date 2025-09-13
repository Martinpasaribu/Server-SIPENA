"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_division_1 = require("../controller/controller_division");
const DivisionRoute = express_1.default.Router();
// semantic meaning
DivisionRoute.get("/", controller_division_1.DivisionControllers.GetDivision);
DivisionRoute.post("/", controller_division_1.DivisionControllers.CreateDivision);
DivisionRoute.get("/code", controller_division_1.DivisionControllers.GetCodeDivision);
DivisionRoute.put("/status/:_id", controller_division_1.DivisionControllers.UpdateDivisionStatus);
DivisionRoute.patch("/:_id", controller_division_1.DivisionControllers.UpdateDivision);
DivisionRoute.delete("/:_id", controller_division_1.DivisionControllers.DeletedDivision);
exports.default = DivisionRoute;
