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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const employee_models_1 = __importDefault(require("../models/employee_models"));
const crypto_1 = __importDefault(require("crypto"));
const employee_models_2 = __importDefault(require("../models/employee_models"));
const service_division_1 = require("../../Division/service/service_division");
dotenv_1.default.config();
class EmployeeController {
    static GetEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield employee_models_2.default.find({ isDeleted: false }).populate({
                    path: "division_key", // masuk ke field dalam array
                    model: "Division", // pastikan model Division sudah didefinisikan
                });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Data Employee.",
                    success: false,
                    data: customer
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static CekEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const users = yield employee_models_1.default.findOne({ user_id: _id });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Employee Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Employee Unavailable.",
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
    static CreateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, phone, role, division_key } = req.body;
            try {
                // Generate user_id: 4 karakter acak + username
                const randomCode = crypto_1.default.randomBytes(1).toString("hex").toUpperCase(); // 4 hex char
                const user_id = `${username}${randomCode}`;
                const required = ["username", "email", "role", "phone"];
                // Cari field kosong
                for (const field of required) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            requestId: (0, uuid_1.v4)(),
                            message: `${field} tidak boleh kosong`,
                            success: false,
                        });
                    }
                }
                // 1. Cek apakah user_id sudah ada
                const existingUser = yield employee_models_2.default.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: `Username ${username} sudah terdaftar.`,
                        success: false
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
                // 3. Cek apakah email & phone sudah ada
                const existingOrder = yield employee_models_2.default.findOne({ email: email, phone: phone });
                if (existingOrder) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Email atau no telepon sudah ada, gunakan yang lain.",
                        success: false,
                    });
                }
                // 3. Hash password jika ada
                let hashPassword = "";
                if (password) {
                    const salt = yield bcrypt_1.default.genSalt();
                    hashPassword = yield bcrypt_1.default.hash(password, salt);
                }
                // 4. Simpan user
                const user = yield employee_models_2.default.create({
                    user_id,
                    username,
                    phone,
                    role,
                    status: 'P',
                    email,
                    division_key: division_key.map((id) => ({ _id: id })),
                    password: hashPassword || undefined,
                });
                if (!user) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "User tidak ditemukan",
                        success: false,
                    });
                }
                yield service_division_1.DivisionServices.AddEmployeeKeyToDivision(user._id, division_key);
                // 6. Respon sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "Employee berhasil didaftarkan.",
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
    static UpdateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const _a = req.body, { password } = _a, data = __rest(_a, ["password"]); // pisahkan password dari field lain
            if (!_id) {
                return res.status(400).json({ success: false, message: "ID kosong" });
            }
            const oldEmployee = yield employee_models_2.default.findById(_id);
            if (!oldEmployee) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
            try {
                // Hash password jika ada
                if (password && password.trim() !== "") {
                    const salt = yield bcrypt_1.default.genSalt();
                    data.password = yield bcrypt_1.default.hash(password, salt);
                }
                const updated = yield employee_models_2.default.findOneAndUpdate({ _id, isDeleted: false }, data, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Employee tidak ditemukan" });
                }
                function normalizeDivisionKey(raw) {
                    if (!raw)
                        return [];
                    return raw.map((d) => { var _a; return (typeof d === "string" ? d : ((_a = d._id) === null || _a === void 0 ? void 0 : _a.toString()) || ""); }).filter(Boolean);
                }
                const oldDivisionIds = normalizeDivisionKey(oldEmployee.division_key);
                const newDivisionIds = normalizeDivisionKey(data.division_key);
                const isSame = oldDivisionIds.length === newDivisionIds.length &&
                    oldDivisionIds.every((id) => newDivisionIds.includes(id));
                if (!isSame) {
                    yield service_division_1.DivisionServices.UpdateEmployeeKeyToDivision(_id, oldDivisionIds, newDivisionIds);
                }
                return res.status(200).json({ success: true, message: "Employee berhasil diupdate", data: updated });
            }
            catch (err) {
                return res.status(500).json({ success: false, message: err.message || "Server error" });
            }
        });
    }
    static DeletedEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            if (!_id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID Employee tidak boleh kosong",
                    success: false,
                });
            }
            try {
                // const deleted = await EmployeeModel.findByIdAndDelete(_id);
                const deleted = yield employee_models_2.default.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Employee tidak ditemukan",
                        success: false,
                    });
                }
                function normalizeDivisionKey(raw) {
                    if (!raw)
                        return [];
                    return raw.map((d) => { var _a; return (typeof d === "string" ? d : ((_a = d._id) === null || _a === void 0 ? void 0 : _a.toString()) || ""); }).filter(Boolean);
                }
                const DivisionId = normalizeDivisionKey(deleted.division_key);
                yield service_division_1.DivisionServices.DelEmployeeKeyToDivision(deleted._id, DivisionId);
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus employee",
                    // UpdateRoom: UpdateRoom,
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
    static UpdateEmployeeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status harus diisi",
                });
            }
            try {
                const updated = yield employee_models_2.default.findOneAndUpdate({ _id, isDeleted: false }, { status }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: "Facility tidak ditemukan",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Status berhasil diupdate",
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
}
exports.EmployeeController = EmployeeController;
