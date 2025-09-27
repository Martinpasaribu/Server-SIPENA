import ItemModel from "../models/contact_models";

// helper untuk format tanggal
function formatDateCode(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return yy + mm + dd;
}

export async function GenerateItemCode(): Promise<string> {
  const today = new Date();
  const dateCode = formatDateCode(today);

  // hitung jumlah item yang dibuat hari ini
  const countToday = await ItemModel.countDocuments({
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lt: new Date(today.setHours(23, 59, 59, 999)),
    },
  });

  // running number 3 digit
  const runningNumber = String(countToday + 1).padStart(3, "0");

  return `C-${dateCode}-${runningNumber}`;
}