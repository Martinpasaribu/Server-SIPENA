import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function formatDate(date?: Date): string {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendTelegramMessage(message: string, data?: Record<string, any>) {
  try {
    let detailText = "";

    if (data) {
      detailText = `
<b>📋 Detail Report</b>
${formatDate(data.createdAt)}
━━━━━━━━━━━━━━
#️⃣ <b>ID:</b> ${data.id ?? "-"}
🛠 <b>Tipe Report:</b> ${data.tipe_Report ?? "-"}
▶️ <b>Tipe Kerusakan:</b> ${data.tipe_Kerusakan ?? "-"}
👤 <b>Karyawan:</b> ${data.name ?? "-"}
🔧 <b>Deskripsi:</b> ${data.desc ?? "-"}
━━━━━━━━━━━━━━
`;
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: `${message}\n${detailText}`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔗 Cek di Sistem",
                url: `https://admin-report.vercel.app/dashboard/report/${data?.id ?? ""}`,
              },
            ],
          ],
        },
      }
    );

    console.log("✅ Message sent to Telegram:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error sending message to Telegram:", error.response?.data || error.message);
    throw error;
  }
}
