import ContactModel from "../models/contact_models";

export async function GenerateContactCode(uniqe: string): Promise<string> {
  if (!uniqe || uniqe.length < 2) {
    throw new Error("contact name minimal 2 karakter");
  }

  const prefix = uniqe.slice(0, 2).toUpperCase();
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");

  let runningNumber = 1;
  let newCode = `C-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;

  // Loop sampai kode belum ada di DB
  while (await ContactModel.exists({ code: newCode })) {
    runningNumber++;
    newCode = `C-${prefix}${day}-${String(runningNumber).padStart(3, "0")}`;
  }

  return newCode;
}
