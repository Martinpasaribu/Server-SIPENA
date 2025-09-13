"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReportSchema = new mongoose_1.default.Schema({
    report_code: { type: String, required: true, unique: true },
    employee_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        // default: '', 
        required: false
    },
    division_key: {
        _id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Division',
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        code: {
            type: String,
            required: false,
        }
    },
    facility_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Facility',
        required: false,
    },
    repair: {
        price: { type: Number, default: '' },
        note: { type: String, default: '' },
        createdAt: { type: String, default: Date.now() }
    },
    report_type: { type: String, required: false, enum: ["BK", "M", "BL", "K"], },
    broken_type: { type: String, required: false, enum: ["R", "S", "B", ""], },
    progress: { type: String, required: false, enum: ["A", "P", "S", "T", "RU"], default: 'A' },
    progress_end: { type: Date, required: false },
    complain_des: { type: String, required: false },
    broken_des: { type: String, required: false },
    admin_note: { type: String, required: false, default: '' },
    status: { type: Boolean, default: false },
    image: { type: String, default: '', required: false },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const ReportModel = mongoose_1.default.model('Report', ReportSchema, 'Report');
exports.default = ReportModel;
