import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // taruh di .env
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // ID dari Meta
const ADMIN_PHONE = process.env.ADMIN_PHONE; // nomor WA admin (format internasional, contoh: 6281234567890)

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp notif terkirim ke:", to);
  } catch (err: any) {
    console.error("❌ Gagal kirim WA:", err.response?.data || err.message);
  }
}
