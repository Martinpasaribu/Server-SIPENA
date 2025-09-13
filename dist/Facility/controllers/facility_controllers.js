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
exports.FacilityControllers = void 0;
const uuid_1 = require("uuid");
const facility_models_1 = __importDefault(require("../models/facility_models"));
class FacilityControllers {
    static PostFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, code, unit, data_before, data_after, category, desc } = req.body;
            try {
                // 1. Validasi input
                if (!name || !code || !unit || !unit || !data_before || !data_after || !desc) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: `All fields can't be empty`,
                        success: false,
                    });
                }
                // 2. Cek apakah code sudah ada di DB
                // const existingRoom = await FacilityModel.findOne({ name: name, code: code.trim().toUpperCase() });
                // if (existingRoom) {
                //     return res.status(409).json({
                //         requestId: uuidv4(),
                //         message: "Kode facilty atau nama fasilitas sudah digunakan",
                //         success: false,
                //     });
                // }
                // 3. Create room
                const newRoom = yield facility_models_1.default.create({
                    code: code.trim().toUpperCase(),
                    unit,
                    name,
                    desc,
                    status: 'A',
                    data_after,
                    data_before,
                    category,
                });
                // 4. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newRoom,
                    message: "Successfully created facility.",
                    success: true,
                });
            }
            catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        });
    }
    static GetFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield facility_models_1.default.find({ isDeleted: false });
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: users,
                    success: true
                });
            }
            catch (error) {
                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message || "Internal Server Error",
                    success: false
                });
            }
        });
    }
    static CekFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const users = yield facility_models_1.default.findOne({ email: email });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division Unavailable.",
                        success: false,
                        data: users
                    });
                }
            }
            catch (error) {
                res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    data: null,
                    message: error.message,
                    success: false
                });
            }
        });
    }
    static UpdateFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params; // Ambil _id dari parameter URL
                const { name, desc, status, data_before, data_after, unit } = req.body; // Ambil data yang akan diperbarui dari body
                if (!_id) {
                    return res.status(400).json({
                        message: "Division ID is required.",
                        success: false
                    });
                }
                const updatedDivision = yield facility_models_1.default.findByIdAndUpdate(_id, { name, desc, status, data_after, data_before, unit }, { new: true } // Mengembalikan dokumen yang diperbarui
                );
                if (!updatedDivision) {
                    return res.status(404).json({
                        message: "Division not found.",
                        success: false
                    });
                }
                res.status(200).json({
                    requestId: updatedDivision._id, // Atau bisa juga menggunakan uuidv4()
                    message: "Division updated successfully.",
                    success: true,
                    data: updatedDivision
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error.",
                    success: false
                });
            }
        });
    }
    static DeletedFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            if (!_id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID Division tidak boleh kosong",
                    success: false,
                });
            }
            try {
                const deleted = yield facility_models_1.default.findByIdAndDelete(_id);
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Division tidak ditemukan",
                        success: false,
                    });
                }
                // 2. Hapus referensi Divisi dari setiap karyawan yang terhubung
                // 🔹 Lakukan perulangan pada array employee_key
                // if (deleted.items_key && deleted.items_key.length > 0) {
                //     const employeeKeys = deleted.items_key.map(emp => emp._id.toString());
                //     // Gunakan Promise.all untuk menjalankan semua penghapusan secara paralel
                //     await Promise.all(employeeKeys.map(employeeId => 
                //         SyncRelationData.RemoveDivisionFromEmployee(employeeId, deleted.employee_key.toString())
                //     ));
                // }
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus employee",
                    // UpdateRoom: UpdateRoom,
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
    static UpdateFacilityStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { status } = req.body;
            if (status === null) {
                return res.status(400).json({
                    success: false,
                    message: "Status harus diisi",
                });
            }
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ _id, isDeleted: false }, { status }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: "Division tidak ditemukan",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Division berhasil diupdate",
                    data: updated,
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Server error",
                });
            }
        });
    }
    static AddImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { image } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { image }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Main image updated successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static AddImageIRepair(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { image_irepair } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { image_IRepair: image_irepair }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "image invoice repair updated successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static AddImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body;
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $push: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image added to gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    static DeletedImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const { images } = req.body; // isi dengan URL yang mau dihapus
            try {
                const updated = yield facility_models_1.default.findOneAndUpdate({ code, isDeleted: false }, { $pull: { images } }, { new: true });
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image removed from gallery successfully",
                    data: updated,
                });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err.message });
            }
        });
    }
    // Sub Data
    static GetCodeFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const division = yield facility_models_1.default.find({ isDeleted: false }, // filter
                { code: 1, status: 1, _id: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: division,
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
    static GetCodeFacilityById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category_id } = req.params;
            try {
                const division = yield facility_models_1.default.find({ category: category_id }, { isDeleted: false }, // filter
                { code: 1, status: 1, _id: 1 } // projection: ambil hanya `code`, sembunyikan `_id`
                );
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: division,
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
exports.FacilityControllers = FacilityControllers;
