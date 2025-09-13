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
exports.DashboardControllers = void 0;
const uuid_1 = require("uuid");
const facility_models_1 = __importDefault(require("../../Facility/models/facility_models"));
const report_models_1 = __importDefault(require("../../Report/models/report_models"));
const employee_models_1 = __importDefault(require("../../Employee/models/employee_models"));
const models_division_1 = __importDefault(require("../../Division/models/models_division"));
class DashboardControllers {
    static GetInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Menghitung jumlah total
                const amountEmployee = yield employee_models_1.default.countDocuments({ isDeleted: false });
                const amountReport = yield report_models_1.default.countDocuments({ isDeleted: false });
                const amountDivision = yield models_division_1.default.countDocuments({ isDeleted: false });
                const amountFacility = yield facility_models_1.default.countDocuments({ isDeleted: false });
                // --- Logika untuk Statistik Laporan per Bulan ---
                const reportStats = yield report_models_1.default.aggregate([
                    {
                        // Tahap 1: Mencocokkan data yang tidak dihapus
                        $match: { isDeleted: false }
                    },
                    {
                        // Tahap 2: Mengelompokkan data berdasarkan bulan
                        $group: {
                            _id: {
                                month: { $month: "$createdAt" },
                                year: { $year: "$createdAt" }
                            },
                            // Menghitung laporan masuk (dibuat)
                            laporanMasuk: { $sum: 1 },
                            // Menghitung laporan selesai (progress = "T")
                            laporanSelesai: {
                                $sum: {
                                    $cond: [{ $in: ["$progress", ["T", "S"]] }, 1, 0]
                                }
                            }
                        }
                    },
                    {
                        // Tahap 3: Mengurutkan hasil berdasarkan tahun dan bulan
                        $sort: { "_id.year": 1, "_id.month": 1 }
                    },
                    {
                        // Tahap 4: Memformat ulang output
                        $project: {
                            _id: 0, // Sembunyikan _id
                            month: "$_id.month",
                            year: "$_id.year",
                            laporanMasuk: 1,
                            laporanSelesai: 1
                        }
                    }
                ]);
                // --- Statistik Jumlah Items per Division ---
                const itemDivision = yield models_division_1.default.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $project: {
                            _id: 0,
                            name: "$code",
                            qty: { $size: { $ifNull: ["$item_key", []] } }, // hitung array
                        },
                    },
                ]);
                // --- Statistik Jumlah Items per Division ---
                const itemFacility = yield facility_models_1.default.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $project: {
                            _id: 0,
                            name: "$code",
                            qty: "$qty", // hitung array
                        },
                    },
                ]);
                // --- Statistik Laporan per Divisi Berdasarkan Tahun & Bulan ---
                const reportDivision = yield report_models_1.default.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                            "division_key._id": { $exists: true, $ne: null }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                code: "$division_key.code",
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            qty: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            code: "$_id.code",
                            year: "$_id.year",
                            month: "$_id.month",
                            qty: 1
                        }
                    },
                    {
                        $sort: { name: 1, year: 1, month: 1 }
                    }
                ]);
                const pendingReports = yield report_models_1.default.find({
                    isDeleted: false,
                    progress: "A",
                    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // lebih dari 1 hari
                }).select("report_code report_type division_key name createdAt -_id");
                // 4. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: {
                        amountEmployee,
                        amountDivision,
                        amountReport,
                        amountFacility,
                        reportStats,
                        itemDivision, // Data statistik laporan baru
                        itemFacility, // Data statistik laporan baru
                        reportDivision, // Data statistik laporan baru
                        pendingReports,
                    },
                    message: "Successfully fetched dashboard info.",
                    success: true,
                });
            }
            catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: (error).message,
                    success: false,
                });
            }
        });
    }
    static GetReportStatusStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeframe = req.query.timeframe || "current_month";
                let startDate;
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                if (timeframe === "last_1_month") {
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                }
                else if (timeframe === "last_2_months") {
                    startDate = new Date(now.setMonth(now.getMonth() - 2));
                }
                else { // current_month
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                }
                const reportStatusStats = yield report_models_1.default.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                            createdAt: { $gte: startDate },
                        },
                    },
                    {
                        $group: {
                            _id: "$progress",
                            count: { $sum: 1 },
                        },
                    },
                ]);
                const formattedData = reportStatusStats.map(item => {
                    let name = "Unknown";
                    if (item._id === "A")
                        name = "Antrian";
                    else if (item._id === "P")
                        name = "Dalam Proses";
                    else if (item._id === "S")
                        name = "Selesai";
                    else if (item._id === "T")
                        name = "Di Tolak ";
                    else if (item._id === "RU")
                        name = "Review Ulang";
                    return {
                        name: name,
                        value: item.count,
                    };
                });
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: formattedData,
                    message: "Report status stats fetched successfully.",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static DeleteFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID room tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield facility_models_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus room",
                    success: true,
                });
            }
            catch (error) {
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        });
    }
    static GetCodeRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield facility_models_1.default.find({ isDeleted: false }, // filter
                { code: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: rooms,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false
                });
            }
        });
    }
}
exports.DashboardControllers = DashboardControllers;
