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
exports.DivisionControllers = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const models_division_1 = __importDefault(require("../models/models_division"));
const sync_relation_1 = require("../../sync-relation");
dotenv_1.default.config();
class DivisionControllers {
    static GetDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Division = yield models_division_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Division Available.",
                    success: true,
                    data: Division
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static CreateDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, code, desc } = req.body;
            try {
                // 1. Cek apakah user_id sudah ada
                const existingUser = yield models_division_1.default.findOne({ code });
                if (existingUser) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: `${code} sudah terdaftar.`,
                        success: false
                    });
                }
                // 4. Simpan user ke DB
                const user = yield models_division_1.default.create({
                    name,
                    code,
                    desc
                });
                // 5. Respon sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "Divisi berhasil didaftarkan.",
                    success: true
                });
            }
            catch (error) {
                console.error("Divisi Error:", error);
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Terjadi kesalahan pada server.",
                    success: false
                });
            }
        });
    }
    static CekDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const users = yield models_division_1.default.findOne({ email: email });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division Unavailable.",
                        success: false,
                        data: users
                    });
                }
            }
            catch (error) {
                res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false
                });
            }
        });
    }
    static UpdateDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params; // Ambil _id dari parameter URL
                const { name, desc, status } = req.body; // Ambil data yang akan diperbarui dari body
                if (!_id) {
                    return res.status(400).json({
                        message: "Division ID is required.",
                        success: false
                    });
                }
                const updatedDivision = yield models_division_1.default.findByIdAndUpdate(_id, { name, desc, status }, { new: true } // Mengembalikan dokumen yang diperbarui
                );
                if (!updatedDivision) {
                    return res.status(404).json({
                        message: "Division not found.",
                        success: false
                    });
                }
                res.status(200).json({
                    requestId: updatedDivision._id, // Atau bisa juga menggunakan uuidv4()
                    message: "Division updated successfully.",
                    success: true,
                    data: updatedDivision
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error.",
                    success: false
                });
            }
        });
    }
    static DeletedDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            if (!_id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID Division tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield models_division_1.default.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division tidak ditemukan",
                        success: false,
                    });
                }
                // 🔹 Hapus referensi Divisi dari relasi Employee 
                if (deleted.employee_key.length > 0) {
                    const employeeKeys = deleted.employee_key.map((itm) => itm._id.toString());
                    yield Promise.all(employeeKeys.map((employeeId) => sync_relation_1.SyncRelationData.RemoveDivisionFromEmployee(employeeId, deleted._id)));
                }
                // 🔹 Hapus referensi Divisi dari Item
                if (deleted.item_key.length > 0) {
                    // const itemKeys = deleted.item_key.map(itm => itm._id.toString());
                    const itemKeys = deleted.item_key.map((itm) => itm._id.toString());
                    yield Promise.all(itemKeys.map((itemId) => sync_relation_1.SyncRelationData.RemoveDivisionFromItems(itemId)));
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: `Division ${deleted.name} berhasil dihapus`,
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
    static UpdateDivisionStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { status } = req.body;
            if (status === null) {
                return res.status(400).json({
                    success: false,
                    message: "Status harus diisi",
                });
            }
            try {
                const updated = yield models_division_1.default.findOneAndUpdate({ _id, isDeleted: false }, { status }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: "Division tidak ditemukan",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Division berhasil diupdate",
                    data: updated,
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error",
                });
            }
        });
    }
    // Sub Controller
    static GetCodeDivision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const division = yield models_division_1.default.find({ isDeleted: false }, // filter
                { code: 1, status: 1, _id: 1, name: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: division,
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
exports.DivisionControllers = DivisionControllers;
