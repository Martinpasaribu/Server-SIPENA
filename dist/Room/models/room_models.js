"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    customer_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'customer',
        // default: '', 
        required: false
    },
    name: { type: String, required: false },
    code: { type: String, unique: true, required: true },
    facility: [
        {
            name: { type: String, required: false, trim: true },
            code: { type: String, required: false, trim: true },
            status: {
                type: String,
                enum: ["B", "P", "T", "R"],
            },
            image: {
                type: String,
                default: "",
                required: false
            }
        }
    ],
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    report_id: { type: String, default: '', required: false },
    images: [{ type: String }],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const RoomModel = mongoose_1.default.model('Room', RoomSchema, 'Room');
exports.default = RoomModel;
