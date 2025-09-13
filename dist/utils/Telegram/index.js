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
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
function formatDate(date) {
    if (!date)
        return "-";
    return new Date(date).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function sendTelegramMessage(message, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            let detailText = "";
            if (data) {
                detailText = `
<b>📋 Detail Report</b>
${formatDate(data.createdAt)}
━━━━━━━━━━━━━━
#️⃣ <b>ID:</b> ${(_a = data.id) !== null && _a !== void 0 ? _a : "-"}
🛠 <b>Tipe Report:</b> ${(_b = data.tipe_Report) !== null && _b !== void 0 ? _b : "-"}
▶️ <b>Tipe Kerusakan:</b> ${(_c = data.tipe_Kerusakan) !== null && _c !== void 0 ? _c : "-"}
👤 <b>Karyawan:</b> ${(_d = data.name) !== null && _d !== void 0 ? _d : "-"}
🔧 <b>Deskripsi:</b> ${(_e = data.desc) !== null && _e !== void 0 ? _e : "-"}
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
                                url: `https://admin-report.vercel.app/dashboard/report/${(_f = data === null || data === void 0 ? void 0 : data.id) !== null && _f !== void 0 ? _f : ""}`,
                            },
                        ],
                    ],
                },
            });
            console.log("✅ Message sent to Telegram:", response.data);
            return response.data;
        }
        catch (error) {
            console.error("❌ Error sending message to Telegram:", ((_g = error.response) === null || _g === void 0 ? void 0 : _g.data) || error.message);
            throw error;
        }
    });
}
