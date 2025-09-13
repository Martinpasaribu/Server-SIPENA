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
exports.refreshTokenEmployee = exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const employee_models_1 = __importDefault(require("../../../Employee/models/employee_models"));
const models_admin_1 = __importDefault(require("../../../Admin/models/models_admin"));
dotenv_1.default.config();
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Cookies:", req.cookies);
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Session cookies empty" });
        }
        // Cari user berdasarkan refresh token
        const user = yield models_admin_1.default.findOne({ refresh_token: refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        // Verifikasi refresh token
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: "Refresh token not verified" });
            }
            // Buat access token baru
            const userId = user._id;
            const name = user.username;
            const email = user.email;
            const accessToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } // **Diperpanjang menjadi 5 menit**
            );
            return res.json({ accessToken });
        }));
    }
    catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.refreshToken = refreshToken;
const refreshTokenEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Cookies:", req.cookies);
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Session cookies empty" });
        }
        // Cari user berdasarkan refresh token
        const user = yield employee_models_1.default.findOne({ refresh_token: refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        // Verifikasi refresh token
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: "Refresh token not verified" });
            }
            // Buat access token baru
            const userId = user._id;
            const name = user.username;
            const email = user.email;
            const accessToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } // **Diperpanjang menjadi 5 menit**
            );
            return res.json({ accessToken });
        }));
    }
    catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.refreshTokenEmployee = refreshTokenEmployee;
