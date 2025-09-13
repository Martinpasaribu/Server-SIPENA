"use strict";
// src/utils/reportCode.ts
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
exports.generateReportCode = generateReportCode;
const counter_models_1 = __importDefault(require("../Report/models/counter_models"));
function generateReportCode(reportType) {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = reportType; // BK, M, BL, K
        const today = new Date();
        const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20250901
        // Increment counter secara atomic
        const counter = yield counter_models_1.default.findOneAndUpdate({ report_type: reportType, date: datePart }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const counterPart = counter.seq.toString().padStart(4, "0"); // 0001
        return `${prefix}-${datePart}-${counterPart}`;
    });
}
