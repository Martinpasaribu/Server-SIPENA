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
exports.AdminController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const models_admin_1 = __importDefault(require("../models/models_admin"));
dotenv_1.default.config();
class AdminController {
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_admin_1.default.find();
                res.status(200).json(users);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static GetAllAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_admin_1.default.find();
                res.status(200).json(users);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static cekUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const users = yield models_admin_1.default.findOne({ email: email });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "User Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "User Unavailable.",
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
    static Register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, username, email, password, phone, role } = req.body;
            try {
                // 1. Cek apakah email sudah terdaftar
                const existingUser = yield models_admin_1.default.findOne({ user_id, email });
                if (existingUser) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: `UserID ${email} sudah terdaftar.`,
                        success: false
                    });
                }
                let hashPassword = "";
                // 3. Hash password jika ada
                if (password) {
                    const salt = yield bcrypt_1.default.genSalt();
                    hashPassword = yield bcrypt_1.default.hash(password, salt);
                }
                // 4. Simpan user ke DB
                const user = yield models_admin_1.default.create({
                    user_id,
                    username,
                    email,
                    role,
                    password: hashPassword || undefined,
                    phone
                });
                // 5. Respon sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "User berhasil didaftarkan.",
                    success: true
                });
            }
            catch (error) {
                console.error("Register Error:", error);
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Terjadi kesalahan pada server.",
                    success: false
                });
            }
        });
    }
    static UpdateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { username, email, user_id, password, role } = req.body;
            if (!_id) {
                return res.status(400).json({ success: false, message: "ID kosong" });
            }
            const oldAdmin = yield models_admin_1.default.findById(_id);
            if (!oldAdmin) {
                return res.status(404).json({ success: false, message: "oldAdmin not found" });
            }
            try {
                const updateData = {};
                // isi hanya kalau ada datanya
                if (username && username.trim() !== "")
                    updateData.username = username;
                if (email && email.trim() !== "")
                    updateData.email = email;
                if (user_id && user_id.trim() !== "")
                    updateData.user_id = user_id;
                if (role && role.trim() !== "")
                    updateData.role = role;
                if (password && password.trim() !== "") {
                    const salt = yield bcrypt_1.default.genSalt();
                    updateData.password = yield bcrypt_1.default.hash(password, salt);
                }
                const updated = yield models_admin_1.default.findOneAndUpdate({ _id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Admin berhasil diupdate",
                    data: updated
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error"
                });
            }
        });
    }
    // Update Role Admin
    static UpdateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const { role } = req.body;
                if (!_id) {
                    return res.status(400).json({ success: false, message: "ID kosong" });
                }
                if (!role) {
                    return res.status(400).json({ success: false, message: "Role wajib diisi" });
                }
                // Validasi role
                const validRoles = ["A", "CA", "SA"];
                if (!validRoles.includes(role)) {
                    return res.status(400).json({ success: false, message: "Role tidak valid" });
                }
                const updated = yield models_admin_1.default.findOneAndUpdate({ _id, isDeleted: false }, { role }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Role admin berhasil diperbarui",
                    data: updated,
                });
            }
            catch (err) {
                return res
                    .status(500)
                    .json({ success: false, message: err.message || "Server error" });
            }
        });
    }
}
exports.AdminController = AdminController;
