"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadImage = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const imagekit = new imagekit_1.default({
    publicKey: process.env.publicKey || "",
    privateKey: process.env.privateKey || "",
    urlEndpoint: process.env.urlEndpoint || "",
});
// 🔹 Fungsi upload ke ImageKit
const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer, // buffer dari multer.memoryStorage()
            fileName: file.originalname,
            folder: "DBTestAdmin",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve((result === null || result === void 0 ? void 0 : result.url) || "");
        });
    });
};
exports.uploadImage = uploadImage;
// 🔹 Storage multer (pakai memory untuk langsung ambil buffer)
const storage = multer_1.default.memoryStorage();
// 🔹 Upload hanya 1 file dengan field "image"
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // maksimal 25MB
}).single("image"); // 👉 hanya untuk 1 file
