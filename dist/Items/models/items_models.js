"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ItemsSchema = new mongoose_1.default.Schema({
    facility_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Facility",
        required: true
    },
    name: { type: String, unique: false, required: false },
    nup: { type: String, unique: true, required: false },
    qty: { type: Number, required: true, default: 1 },
    desc: { type: String, unique: true, required: false },
    division_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Division', required: false, default: null
    },
    status: {
        type: String,
        required: false,
        enum: ["A", "R", "B"],
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const ItemModel = mongoose_1.default.model("Items", ItemsSchema, "Items");
exports.default = ItemModel;
