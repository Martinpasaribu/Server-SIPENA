"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContactSchema = new mongoose_1.default.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    message: { type: String, required: false },
    phone: { type: Number, required: false },
    code: { type: String, required: false },
    status: {
        type: String,
        required: false,
        enum: ["UR", "R"],
        default: "UR"
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const ContactModel = mongoose_1.default.model("Contact", ContactSchema, "Contact");
exports.default = ContactModel;
