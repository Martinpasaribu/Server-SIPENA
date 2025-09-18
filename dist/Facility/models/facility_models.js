"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FacilitySchema = new mongoose_1.default.Schema({
    code: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: false },
    desc: { type: String, unique: false, required: false },
    qty: { type: Number, required: true, default: 0 },
    unit: {
        type: String,
        required: false,
        enum: ["D", "U", "B"],
    },
    status: {
        type: String,
        required: false,
        enum: ["A", "R", "B"],
    },
    data_before: {
        qty: { type: Number, required: false },
        price: { type: Number, required: false },
        date: { type: Date, required: false }
    },
    items_key: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Items", required: false },
    ],
    data_after: {
        qty: { type: Number, required: false },
        price: { type: Number, required: false },
        date: { type: Date, required: false }
    },
    category: {
        type: String,
        required: false,
        enum: ["BK", "M", "BL"],
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const FacilityModel = mongoose_1.default.model("Facility", FacilitySchema, "Facility");
exports.default = FacilityModel;
