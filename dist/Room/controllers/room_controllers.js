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
exports.RoomControllers = void 0;
const uuid_1 = require("uuid");
const room_models_1 = __importDefault(require("../models/room_models"));
class RoomControllers {
    static PostRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, price, facility } = req.body;
            try {
                // 1. Validasi input
                if (!code || !price) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All fields can't be empty`,
                        success: false,
                    });
                }
                // 2. Cek apakah code sudah ada di DB
                const existingRoom = yield room_models_1.default.findOne({ code: code.trim().toUpperCase() });
                if (existingRoom) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Kode room sudah digunakan, silakan gunakan kode lain.",
                        success: false,
                    });
                }
                // 3. Create room
                const newRoom = yield room_models_1.default.create({
                    code: code.trim().toUpperCase(),
                    price,
                    facility: facility
                });
                // 4. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newRoom,
                    message: "Successfully created room.",
                    success: true,
                });
            }
            catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static GetRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield room_models_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
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
    static DeleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID room tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield room_models_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus room",
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
    static GetFacilities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            try {
                const room = yield room_models_1.default.findById(roomId);
                if (!room) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: room.facility,
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
    static UpdateFacilityStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, facilityCode } = req.params;
            const { status } = req.body;
            // Validasi status sesuai enum
            const allowedStatus = ["B", "P", "T", "R"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Status harus salah satu dari: good, warning, alert",
                    success: false,
                });
            }
            try {
                const updatedRoom = yield room_models_1.default.findOneAndUpdate({ _id: roomId, "facility.code": facilityCode }, { $set: { "facility.$.status": status } }, { new: true });
                if (!updatedRoom) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room atau facility tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil update status facility",
                    data: updatedRoom.facility,
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
    // POST tambah facility
    static AddFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId } = req.params;
                const { code, name, status } = req.body;
                if (!code || !name || !status) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Code, name, dan status wajib diisi",
                        success: false,
                    });
                }
                const room = yield room_models_1.default.findById(roomId);
                if (!room) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }
                // cek duplikat
                const exists = room.facility.some((f) => f.code.toUpperCase() === code.toUpperCase());
                if (exists) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Facility sudah ada di room ini",
                        success: false,
                    });
                }
                room.facility.push({
                    code: code.toUpperCase(),
                    name,
                    status,
                    image: ''
                });
                yield room.save();
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Facility berhasil ditambahkan",
                    success: true,
                    data: room.facility,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static AddImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body;
            try {
                const updated = yield room_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $push: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image added to gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static DeletedImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body; // isi dengan URL yang mau dihapus
            try {
                const updated = yield room_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $pull: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image removed from gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static UploadFacilityImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, facilityId } = req.params;
            const { image } = req.body; // udah diisi di middleware
            try {
                const room = yield room_models_1.default.findOneAndUpdate({ code, "facility._id": facilityId }, { $set: { "facility.$.image": image } }, { new: true });
                if (!room) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room or facility not found",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: room,
                    message: "Facility image updated successfully",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static DeleteFacilityImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, facilityId } = req.params;
            try {
                const room = yield room_models_1.default.findOneAndUpdate({ code: code, "facility._id": facilityId }, { $unset: { "facility.$.image": "" } }, { new: true });
                if (!room) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room or facility not found",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: room,
                    message: "Facility image deleted successfully",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    // Sub Data
    static GetCodeRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield room_models_1.default.find({ isDeleted: false }, // filter
                { code: 1, status: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
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
exports.RoomControllers = RoomControllers;
