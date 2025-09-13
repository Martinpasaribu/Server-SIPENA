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
exports.BookingControllers = void 0;
const uuid_1 = require("uuid");
const room_models_1 = __importDefault(require("../../Room/models/room_models"));
const booking_models_1 = __importDefault(require("../models/booking_models"));
const service_room_1 = require("../../Room/services/service_room");
class BookingControllers {
    static PostBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, room_key, booking_date, phone } = req.body;
            try {
                // 1. Validasi input kosong
                if (!username || !email || !room_key || !phone || !booking_date) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All fields can't be empty`,
                        success: false,
                    });
                }
                // 2. Validasi format email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Format email tidak valid.",
                        success: false,
                    });
                }
                const RoomStatus = yield service_room_1.RoomServices.CekRoomAvailable(room_key);
                if (RoomStatus === false) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room yang dipilih tidak tersedia",
                        success: false,
                    });
                }
                // 3. Cek apakah email & phone sudah ada
                const existingOrder = yield booking_models_1.default.findOne({ email: email, phone: phone });
                if (existingOrder) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Email atau no telepon sudah ada, gunakan yang lain.",
                        success: false,
                    });
                }
                // 4. Simpan order
                const newOrder = yield booking_models_1.default.create({
                    email,
                    phone,
                    username,
                    booking_date,
                    room_key,
                });
                // 5. Respon sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newOrder,
                    message: "Successfully add Booking.",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static GetBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield booking_models_1.default.find({ isDeleted: false }).populate('room_key');
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: booking,
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
    static DeleteBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID Booking tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield booking_models_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Booking tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus booking",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        });
    }
    static UpdateBookingStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, room_key } = req.params;
                const { status } = req.body;
                if (!status) {
                    return res.status(400).json({ message: "Status is required" });
                }
                const updatedBooking = yield booking_models_1.default.findByIdAndUpdate(id, { status }, { new: true });
                if (!updatedBooking) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                const updateRoom = yield service_room_1.RoomServices.KeepRoomBooking(status, room_key);
                if (!updatedBooking) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                res.status(200).json({
                    message: "Booking status updated successfully",
                    data: updatedBooking,
                    updateRoom: updateRoom,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // Sub Data
    static GetCodeRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield room_models_1.default.find({ isDeleted: false }, // filter
                { code: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: rooms,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
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
exports.BookingControllers = BookingControllers;
