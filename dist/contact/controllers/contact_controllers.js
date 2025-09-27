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
exports.ContactControllers = void 0;
const uuid_1 = require("uuid");
const contact_models_1 = __importDefault(require("../models/contact_models"));
const constant_1 = require("../constant");
class ContactControllers {
    // Baru update
    static PostContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, message, phone } = req.body;
            try {
                // 1. Validasi input
                if (!name || !email || !phone) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `semua field tidak boleh kosong `,
                        success: false,
                    });
                }
                // 4. Generate kode item baru
                const generatedCode = yield (0, constant_1.GenerateContactCode)(name);
                // 5. Create Item
                const newItem = yield contact_models_1.default.create({
                    code: generatedCode, // simpan kode item di sini
                    name,
                    email,
                    phone,
                    message,
                    createdAt: new Date(),
                });
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newItem,
                    message: "Pesan anda berhasil dikirim",
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
    // GET all messages
    static GetAllContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ambil semua pesan yang belum dihapus
                const messages = yield contact_models_1.default.find({ isDeleted: false }).sort({ createdAt: -1 });
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: messages,
                    message: "Berhasil mengambil semua pesan",
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
    // Optional: GET single message by ID
    static ContactRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const message = yield contact_models_1.default.findOneAndUpdate({ _id: id }, { status: "R" });
                if (!message) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        data: null,
                        message: "Pesan tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: message,
                    message: "Berhasil mengambil pesan",
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
}
exports.ContactControllers = ContactControllers;
