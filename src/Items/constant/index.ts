import ItemModel from "../models/items_models";

export async function GenerateItemCode(uniqe: string): Promise<string> {
  if (!uniqe || uniqe.length < 2) {
    throw new Error("Facility name minimal 2 karakter");
  }

  const prefix = uniqe.slice(0, 2).toUpperCase();
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");

  let runningNumber = 1;
  let newCode = `I-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;

  // Loop sampai kode belum ada di DB
  while (await ItemModel.exists({ code: newCode })) {
    runningNumber++;
    newCode = `I-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;
  }

  return newCode;
}
