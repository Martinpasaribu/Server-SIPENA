// Jenis laporan
export const TypeReport = (status: string) => {
  const map: Record<string, string> = {
    BL: "Bangunan Lainnya",
    BK: "Bangunan Kantor",
    M: "Mesin",
    K: "Komplain",
  };

  return map[status] || status; // fallback: tampilkan kode asli
};

// Jenis kerusakan
export const TypeBroken = (status: string) => {
  const map: Record<string, string> = {
    R: "Ringan",
    S: "Sedang",
    B: "Berat",
  };

  return map[status] || status;
};
