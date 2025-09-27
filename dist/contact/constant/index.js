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
exports.GenerateContactCode = GenerateContactCode;
const contact_models_1 = __importDefault(require("../models/contact_models"));
function GenerateContactCode(uniqe) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uniqe || uniqe.length < 2) {
            throw new Error("contact name minimal 2 karakter");
        }
        const prefix = uniqe.slice(0, 2).toUpperCase();
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        let runningNumber = 1;
        let newCode = `C-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;
        // Loop sampai kode belum ada di DB
        while (yield contact_models_1.default.exists({ code: newCode })) {
            runningNumber++;
            newCode = `C-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;
        }
        return newCode;
    });
}
