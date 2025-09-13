"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredFields = validateRequiredFields;
// utils/validateRequiredFields.ts
function validateRequiredFields(data, requiredFields) {
    const emptyFields = [];
    for (const field of requiredFields) {
        const value = data[field];
        if (value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "")) {
            emptyFields.push(field);
        }
    }
    return emptyFields;
}
