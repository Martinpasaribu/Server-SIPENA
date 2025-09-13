"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerControllers = void 0;
const uuid_1 = require("uuid");
const lead_models_1 = __importDefault(require("../models/lead_models"));
const employee_models_1 = __importDefault(require("../Employee/models/employee_models"));
// import CustomerModel from '../models/customer';
class CustomerControllers {
    static CreateCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, email, phone } = req.body;
            try {
                if (!username || !password || !email || !phone) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All Field can't be empty`,
                    });
                }
                ;
                const customer = yield employee_models_1.default.create({
                    username: username,
                    password: password,
                    email: email,
                    phone: phone,
                });
                res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: customer,
                    message: "Successfully create customer.",
                    success: true
                });
            }
            catch (error) {
                res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false
                });
            }
        });
    }
    static getCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield employee_models_1.default.find({ isDeleted: false }).populate('room_key').lean();
                ;
                ;
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: customer,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static GetLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield lead_models_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false
                });
            }
        });
    }
}
exports.CustomerControllers = CustomerControllers;
