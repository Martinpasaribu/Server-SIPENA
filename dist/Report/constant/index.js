"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBroken = exports.TypeReport = void 0;
// Jenis laporan
const TypeReport = (status) => {
    const map = {
        BL: "Bangunan Lainnya",
        BK: "Bangunan Kantor",
        M: "Mesin",
        K: "Komplain",
    };
    return map[status] || status; // fallback: tampilkan kode asli
};
exports.TypeReport = TypeReport;
// Jenis kerusakan
const TypeBroken = (status) => {
    const map = {
        R: "Ringan",
        S: "Sedang",
        B: "Berat",
    };
    return map[status] || status;
};
exports.TypeBroken = TypeBroken;
