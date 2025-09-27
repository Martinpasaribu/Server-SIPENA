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
exports.sendTelegramMessage = sendTelegramMessage;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
function formatDate(date) {
    if (!date)
        return "-";
    return (0, dayjs_1.default)(date)
        .tz("Asia/Makassar") // WITA (UTC+8)
        .format("DD MMM YYYY HH:mm"); // contoh: 27 Sep 2025 16:05
}
function sendTelegramMessage(message, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            let detailText = "";
            if (data) {
                detailText = `
<b>📋 Detail Report</b>
${formatDate(data.createdAt)}
━━━━━━━━━━━━━━
#️⃣ <b>ID:</b> ${(_a = data.id) !== null && _a !== void 0 ? _a : "-"}
🛠 <b>Tipe Report:</b> ${(_b = data.tipe_Report) !== null && _b !== void 0 ? _b : "-"}
🛠 <b>Fasilitas:</b> ${(_c = data.facility) !== null && _c !== void 0 ? _c : "-"}
▶️ <b>Tipe Kerusakan:</b> ${(_d = data.tipe_Kerusakan) !== null && _d !== void 0 ? _d : "-"}
👤 <b>Karyawan:</b> ${(_e = data.name) !== null && _e !== void 0 ? _e : "-"}
🔧 <b>Deskripsi:</b> ${(_f = data.desc) !== null && _f !== void 0 ? _f : "-"}
━━━━━━━━━━━━━━
`;
            }
            const response = yield axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `${message}\n${detailText}`,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🔗 Cek di Sistem",
                                url: `https://admin-report.vercel.app/dashboard/report/${(_g = data === null || data === void 0 ? void 0 : data.id) !== null && _g !== void 0 ? _g : ""}`,
                            },
                        ],
                    ],
                },
            });
            console.log("✅ Message sent to Telegram:", response.data);
            return response.data;
        }
        catch (error) {
            console.error("❌ Error sending message to Telegram:", ((_h = error.response) === null || _h === void 0 ? void 0 : _h.data) || error.message);
            throw error;
        }
    });
}
