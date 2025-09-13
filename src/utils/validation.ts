// utils/validateRequiredFields.ts
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): string[] {
  const emptyFields: string[] = [];

  for (const field of requiredFields) {
    const value = data[field];

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      emptyFields.push(field);
    }
  }

  return emptyFields;
}
