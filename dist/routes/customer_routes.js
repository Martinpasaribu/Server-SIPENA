"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = require("../controllers/customer");
const CustomerRoutes = express_1.default.Router();
CustomerRoutes.post('/', customer_1.CustomerControllers.CreateCustomer);
CustomerRoutes.get('/', customer_1.CustomerControllers.getCustomer);
exports.default = CustomerRoutes;
