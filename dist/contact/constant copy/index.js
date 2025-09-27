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
exports.GenerateItemCode = GenerateItemCode;
const items_models_1 = __importDefault(require("../models/items_models"));
// helper untuk format tanggal
function formatDateCode(date) {
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return yy + mm + dd;
}
function GenerateItemCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const dateCode = formatDateCode(today);
        // hitung jumlah item yang dibuat hari ini
        const countToday = yield items_models_1.default.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999)),
            },
        });
        // running number 3 digit
        const runningNumber = String(countToday + 1).padStart(3, "0");
        return `I-${dateCode}-${runningNumber}`;
    });
}
