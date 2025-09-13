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
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const axios_1 = __importDefault(require("axios"));
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // taruh di .env
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // ID dari Meta
const ADMIN_PHONE = process.env.ADMIN_PHONE; // nomor WA admin (format internasional, contoh: 6281234567890)
function sendWhatsAppMessage(to, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
            yield axios_1.default.post(url, {
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: message },
            }, {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("✅ WhatsApp notif terkirim ke:", to);
        }
        catch (err) {
            console.error("❌ Gagal kirim WA:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        }
    });
}
