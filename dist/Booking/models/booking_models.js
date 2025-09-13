"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true, required: false },
    room_key: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'Room'
    },
    phone: { type: Number, required: true },
    email: { type: String, default: "" },
    booking_date: { type: Date, required: false },
    status: { type: String, default: 'pending', enum: ["pending", "confirmed", "canceled"], required: false },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const BookingModel = mongoose_1.default.model('Booking', BookingSchema, 'Booking');
exports.default = BookingModel;
