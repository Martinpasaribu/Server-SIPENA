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
exports.ItemsControllers = void 0;
const uuid_1 = require("uuid");
const items_models_1 = __importDefault(require("../models/items_models"));
const models_division_1 = __importDefault(require("../../Division/models/models_division"));
const facility_models_1 = __importDefault(require("../../Facility/models/facility_models"));
const service_division_1 = require("../../Division/service/service_division");
class ItemsControllers {
    static PostItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, nup, desc, division_key, status } = req.body;
            const { facility_key } = req.params;
            try {
                // 1. Validasi input
                if (!name || !facility_key || !nup || !desc || !division_key) {
                    return res.status(400).json({
                        requestId: (0, uuid_1.v4)(),
                        message: ` All fields can't be empty `,
                        success: false,
                    });
                }
                // 2. Cek apakah code sudah ada di DB
                const facilityFind = yield facility_models_1.default.findOne({ _id: facility_key, isDeleted: false });
                if (!facilityFind) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Facility tidak tersedia",
                        facilityFind,
                        success: false,
                    });
                }
                // 2. Cek apakah code sudah ada di DB
                const existingRoom = yield items_models_1.default.findOne({ nup: nup });
                if (existingRoom) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: " NUP sudah digunakan ",
                        success: false,
                    });
                }
                // 3. Cek apakah code sudah ada di DB
                const division = yield models_division_1.default.findOne({ _id: division_key, status: false });
                if (division) {
                    return res.status(409).json({
                        requestId: (0, uuid_1.v4)(),
                        message: " division yang dipilih sudah tidak aktif ",
                        division,
                        existingRoom,
                        success: false,
                    });
                }
                // 3. Create room
                const newItem = yield items_models_1.default.create({
                    name,
                    facility_key,
                    division_key,
                    nup,
                    desc,
                    status,
                });
                // ✅ Update Division -> tambahkan item ke division yang dipilih
                yield models_division_1.default.findOneAndUpdate({ _id: division_key, isDeleted: false }, {
                    $push: { item_key: { _id: newItem._id } }, // masukkan id item baru
                }, { new: true });
                const facility = yield facility_models_1.default.findOneAndUpdate({ _id: facility_key, isDeleted: false }, { $inc: { qty: 1 } }, { new: true } // ✅ return document setelah update
                );
                if (!facility) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Facility tidak tersedia",
                        facility,
                        success: false,
                    });
                }
                // 4. Response sukses
                return res.status(201).json({
                    requestId: (0, uuid_1.v4)(),
                    data: newItem,
                    message: " Successfully created items ",
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
    static GetItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Items = yield items_models_1.default.find({ isDeleted: false }).populate('division_key');
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: Items,
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
    static GetItemsFacility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            try {
                const Items = yield items_models_1.default.find({ facility_key: _id, isDeleted: false }).populate('division_key');
                res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    data: Items,
                    success: true,
                    message: 'Success Fetch data items facility'
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
    static CekItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nup } = req.params;
                const users = yield items_models_1.default.findOne({ nup: nup });
                if (users) {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Items Available.",
                        success: true,
                        data: users
                    });
                }
                else {
                    res.status(200).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Items Unavailable.",
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
    static UpdateItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params; // Ambil _id dari parameter URL
                const { name, nup, desc, division_key, qty, status } = req.body; // Ambil data yang akan diperbarui dari body
                if (!_id) {
                    return res.status(400).json({
                        message: "Items ID is required.",
                        success: false
                    });
                }
                // 1. Cari item lama untuk tahu division lama
                const oldItem = yield items_models_1.default.findById(_id);
                if (!oldItem) {
                    return res.status(404).json({ success: false, message: "Item not found" });
                }
                const oldDivisionKey = oldItem.division_key;
                // 👇 kalau division_key kosong, ubah ke null
                const safeDivisionKey = division_key && division_key !== "" ? division_key : null;
                const updatedItem = yield items_models_1.default.findByIdAndUpdate(_id, { name, desc, status, nup, division_key: safeDivisionKey, qty }, { new: true });
                if (!updatedItem) {
                    return res.status(404).json({ success: false, message: "Item not found" });
                }
                // 3. Hapus item dari division lama (kalau ada)
                if (oldDivisionKey) {
                    yield models_division_1.default.findOneAndUpdate({ _id: oldDivisionKey, isDeleted: false }, { $pull: { item_key: updatedItem._id } } // cukup ObjectId langsung
                    );
                }
                // 4. Tambahkan item ke division baru
                if (division_key) {
                    yield models_division_1.default.findOneAndUpdate({ _id: division_key, isDeleted: false }, { $addToSet: { item_key: updatedItem._id } }, // bukan object
                    { new: true });
                }
                if (!updatedItem) {
                    return res.status(404).json({
                        message: "Item not found.",
                        success: false
                    });
                }
                res.status(200).json({
                    requestId: updatedItem._id, // Atau bisa juga menggunakan uuidv4()
                    message: "Items updated successfully.",
                    success: true,
                    data: updatedItem
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
    static DeletedItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            if (!_id) {
                return res.status(400).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "ID Items tidak boleh kosong",
                    success: false,
                });
            }
            try {
                // const deleted = await ItemModel.findByIdAndDelete(_id);
                const deleted = yield items_models_1.default.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
                if (!deleted) {
                    return res.status(404).json({
                        requestId: (0, uuid_1.v4)(),
                        message: "Items tidak ditemukan",
                        success: false,
                    });
                }
                // ambil _id facility dari item yang dihapus
                const facilityId = deleted.facility_key;
                const UpdateItems = yield facility_models_1.default.findOneAndUpdate({ _id: facilityId }, { $inc: { qty: -1 } }, // kurangi qty sebanyak 1
                { new: true } // kembalikan dokumen terbaru
                );
                yield service_division_1.DivisionServices.DelItemsKeyToDivision(deleted._id, deleted.division_key);
                return res.status(200).json({
                    requestId: (0, uuid_1.v4)(),
                    message: "Berhasil menghapus Items",
                    UpdateItems,
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
    static UpdateItemsStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const { status } = req.body;
            if (status === null) {
                return res.status(400).json({
                    success: false,
                    message: "Status Items harus di isi",
                });
            }
            try {
                const updated = yield items_models_1.default.findOneAndUpdate({ _id, isDeleted: false }, { status }, { new: true, runValidators: true });
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: "Items tidak ditemukan",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Items berhasil diupdate",
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
}
exports.ItemsControllers = ItemsControllers;
