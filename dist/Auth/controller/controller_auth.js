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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_decode_1 = require("jwt-decode");
const uuid_1 = require("uuid");
const employee_models_1 = __importDefault(require("../../Employee/models/employee_models"));
const models_admin_1 = __importDefault(require("../../Admin/models/models_admin"));
dotenv_1.default.config();
class AuthController {
    static LoginEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield employee_models_1.default.findOne({ user_id: req.body.user_id, isDeleted: false });
                if (!user) {
                    return res.status(404).json({ message: `Employee not found ${req.body.user_id}` });
                }
                if (user.status === 'B') {
                    return res.status(401).json({ message: `Your Account is Blocked ${user.username}` });
                }
                if (user.status === 'P') {
                    return res.status(401).json({ message: `Your Account is Pending ${user.username}` });
                }
                const match = yield bcrypt_1.default.compare(req.body.password, user.password);
                if (!match) {
                    return res.status(400).json({ message: "Wrong password" });
                }
                if (req.body.password !== req.body.password) {
                    return res.status(400).json({ message: "Passwords are not the same" });
                }
                const userId = user._id;
                const username = user.username;
                const email = user.email;
                req.session.userId = userId;
                const accessToken = jsonwebtoken_1.default.sign({ userId, username, email }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '30m'
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId, username, email }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '1d'
                });
                yield employee_models_1.default.findOneAndUpdate({ _id: userId }, // Cari berdasarkan userId saja
                { refresh_token: refreshToken }, // Update refresh_token
                { new: true, runValidators: true } // Opsional: agar dokumen yang diperbarui dikembalikan
                );
                const isProduction = process.env.NODE_ENV === 'production';
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: isProduction ? true : false,
                    sameSite: isProduction ? 'None' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: isProduction ? true : false,
                    sameSite: isProduction ? 'None' : 'lax',
                    maxAge: 20 * 1000
                });
                const decodedRefreshToken = (0, jwt_decode_1.jwtDecode)(refreshToken);
                const expiresIn = decodedRefreshToken.exp;
                console.log(decodedRefreshToken);
                res.json({
                    requestId: (0, uuid_1.v4)(),
                    data: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expiresIn: expiresIn,
                        user: user
                    },
                    message: "Successfully Login",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Error during login:', error);
                res.status(500).json({
                    message: "An error occurred during login",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack
                });
            }
        });
    }
    ;
    static Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
                // const recaptchaResponse = await axios.get(
                //     `https://www.google.com/recaptcha/api/siteverify`,
                //     {
                //         params: {
                //             secret: recaptchaSecret,
                //             response: req.body.recaptchaToken,
                //         },
                //     }
                // );
                // const recaptchaData = recaptchaResponse.data;
                // Periksa status reCAPTCHA
                // if (!recaptchaData.success || recaptchaData.score < 0.5) {
                //     return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
                // }
                const user = yield models_admin_1.default.findOne({ user_id: req.body.user_id, isDeleted: false });
                if (!user) {
                    return res.status(404).json({ message: `User not found ${req.body.user_id}` });
                }
                if (!user.password) {
                    return res.status(500).json({ message: "Set Password New", status: false });
                }
                const match = yield bcrypt_1.default.compare(req.body.password, user.password);
                if (!match) {
                    return res.status(400).json({ message: "Wrong password" });
                }
                if (req.body.password !== req.body.password) {
                    return res.status(400).json({ message: "Passwords are not the same" });
                }
                const userId = user._id;
                const name = user.username;
                const email = user.email;
                req.session.userId = userId;
                const accessToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '30m'
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '1d'
                });
                // const accessToken = jwt.sign(
                //     { userId, name, email }, 
                //     process.env.ACCESS_TOKEN_SECRET as string, 
                //     {
                //       expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || "5m") as jwt.SignOptions["expiresIn"]
                //     }
                // );
                // const refreshToken = jwt.sign(
                //   { userId, name, email },
                //   process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
                //   { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || "7d") as jwt.SignOptions["expiresIn"] }
                // );
                yield models_admin_1.default.findOneAndUpdate({ _id: userId }, // Cari berdasarkan userId saja
                { refresh_token: refreshToken }, // Update refresh_token
                { new: true, runValidators: true } // Opsional: agar dokumen yang diperbarui dikembalikan
                );
                const isProduction = process.env.NODE_ENV === 'production';
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: isProduction ? true : false,
                    sameSite: isProduction ? 'None' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: isProduction ? true : false,
                    sameSite: isProduction ? 'None' : 'lax',
                    maxAge: 20 * 1000
                });
                const decodedRefreshToken = (0, jwt_decode_1.jwtDecode)(refreshToken);
                const expiresIn = decodedRefreshToken.exp;
                console.log(decodedRefreshToken);
                res.json({
                    requestId: (0, uuid_1.v4)(),
                    data: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expiresIn: expiresIn,
                        user: user
                    },
                    message: "Successfully Login",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Error during login:', error);
                res.status(500).json({
                    message: "An error occurred during login",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack
                });
            }
        });
    }
    ;
    static LogoutEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                // Jika tidak ada refresh token di cookie, langsung kirim status 204 (No Content)
                if (!refreshToken) {
                    return res.status(404).json({
                        message: "RefreshToken not found",
                        success: false,
                    });
                }
                // Cari user berdasarkan refresh token
                const user = yield employee_models_1.default.findOne({ refresh_token: refreshToken });
                if (!user) {
                    return res.status(404).json({
                        message: "Employee not found",
                        success: false,
                    });
                }
                const userId = user._id;
                // Update refresh token menjadi null untuk user tersebut
                yield employee_models_1.default.findOneAndUpdate({ _id: userId }, { refresh_token: null });
                // Hapus cookie refreshToken
                res.clearCookie('refreshToken');
                // Hancurkan sesi
                req.session.destroy((err) => {
                    if (err) {
                        // Jika terjadi error saat menghancurkan sesi
                        return res.status(500).json({
                            message: "Could not log out",
                            success: false,
                        });
                    }
                    // Kirim respons logout berhasil
                    res.status(200).json({
                        message: "Success logout",
                        data: {
                            pesan: "Logout berhasil",
                        },
                        success: true,
                    });
                });
            }
            catch (error) {
                // Tangani error lainnya
                res.status(500).json({
                    message: "An error occurred during logout",
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    static Logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                // Jika tidak ada refresh token di cookie, langsung kirim status 204 (No Content)
                if (!refreshToken) {
                    return res.status(404).json({
                        message: "RefreshToken not found",
                        success: false,
                    });
                }
                // Cari user berdasarkan refresh token
                const user = yield models_admin_1.default.findOne({ refresh_token: refreshToken });
                if (!user) {
                    return res.status(404).json({
                        message: "User not found",
                        success: false,
                    });
                }
                const userId = user._id;
                // Update refresh token menjadi null untuk user tersebut
                yield models_admin_1.default.findOneAndUpdate({ _id: userId }, { refresh_token: null });
                // Hapus cookie refreshToken
                res.clearCookie('refreshToken');
                // Hancurkan sesi
                req.session.destroy((err) => {
                    if (err) {
                        // Jika terjadi error saat menghancurkan sesi
                        return res.status(500).json({
                            message: "Could not log out",
                            success: false,
                        });
                    }
                    // Kirim respons logout berhasil
                    res.status(200).json({
                        message: "Success logout",
                        data: {
                            pesan: "Logout berhasil",
                        },
                        success: true,
                    });
                });
            }
            catch (error) {
                // Tangani error lainnya
                res.status(500).json({
                    message: "An error occurred during logout",
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    static Me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.userId) {
                    return res.status(401).json({ message: "Your session-Id no exists", success: false });
                }
                const user = yield models_admin_1.default.findOne({ _id: req.session.userId }, {
                    uuid: true,
                    name: true,
                    phone: true,
                    email: true,
                });
                if (!user)
                    return res.status(404).json({ message: "Your session-Id no register", success: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "Your session-Id exists",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Error during Session-Id:', error);
                res.status(500).json({
                    message: "An error occurred during Session-Id:",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack,
                    success: false
                });
            }
        });
    }
    static MeEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.userId) {
                    return res.status(401).json({ message: "Your session-Id no exists", success: false });
                }
                const user = yield employee_models_1.default.findOne({ _id: req.session.userId }, {
                    _id: true,
                    username: true,
                    phone: true,
                    email: true,
                    division_key: true,
                    status: true,
                    role: true,
                }).populate({
                    path: "division_key", // populate Division
                    model: "Division",
                    populate: {
                        path: "item_key", // <-- nested populate ke Items
                        model: "Items",
                        select: "name code status ", // ambil field yang dibutuhkan
                    },
                }).lean();
                if (!user)
                    return res.status(404).json({ message: "Your session-Id no register", success: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: user,
                    message: "Your session-Id exists",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Error during Session-Id:', error);
                res.status(500).json({
                    message: "An error occurred during Session-Id:",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack,
                    success: false
                });
            }
        });
    }
    static CheckRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Cookies:", req.cookies);
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(403).json({
                        data: false,
                        message: "Session cookies empty"
                    });
                }
                // Cari user berdasarkan refresh token
                const user = yield models_admin_1.default.findOne({ refresh_token: refreshToken });
                if (!user) {
                    return res.status(403).json({
                        data: false,
                        message: "Invalid refresh token"
                    });
                }
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: true,
                    message: "Your session-Id exists",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Refresh Token Error:', error);
                res.status(500).json({
                    message: "An error occurred during Refresh Token :",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack,
                    success: false
                });
            }
        });
    }
    static CheckRefreshTokenEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Cookies:", req.cookies);
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(403).json({
                        data: false,
                        message: "Session cookies empty"
                    });
                }
                // Cari user berdasarkan refresh token
                const user = yield employee_models_1.default.findOne({ refresh_token: refreshToken });
                if (!user) {
                    return res.status(403).json({
                        data: false,
                        message: "Invalid refresh token"
                    });
                }
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: true,
                    message: "Your session-Id exists",
                    success: true
                });
            }
            catch (error) {
                const axiosError = error;
                const errorResponseData = axiosError.response ? axiosError.response.status : null;
                console.error('Refresh Token Error:', error);
                res.status(500).json({
                    message: "An error occurred during Refresh Token :",
                    error: axiosError.message,
                    error2: errorResponseData,
                    stack: axiosError.stack,
                    success: false
                });
            }
        });
    }
}
exports.AuthController = AuthController;
