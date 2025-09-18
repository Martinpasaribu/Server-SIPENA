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
exports.DivisionServices = void 0;
const models_division_1 = __importDefault(require("../models/models_division"));
class DivisionService {
    DelItemsKeyToDivision(ItemsId, DivisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ItemsId && !DivisionId) {
                throw new Error("ItemsIdId & DivisionId Kosong");
            }
            yield models_division_1.default.findOneAndUpdate({ _id: DivisionId, isDeleted: false }, { $pull: { item_key: ItemsId } }, // pakai $addToSet biar gak duplikat
            { new: true });
            console.log(' data 1', ItemsId);
            console.log(' data 2', DivisionId);
        });
    }
    DelEmployeeKeyToDivision(EmployeeId, DivisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!EmployeeId && !DivisionId) {
                throw new Error("ItemsIdId & DivisionId Kosong");
            }
            if (DivisionId.length > 0) {
                for (const divisionId of DivisionId) {
                    yield models_division_1.default.findOneAndUpdate({ _id: divisionId, isDeleted: false }, { $pull: { employee_key: EmployeeId } });
                }
            }
            console.log(' data 1', EmployeeId);
            console.log(' data 2', DivisionId);
        });
    }
    AddEmployeeKeyToDivision(EmployeeId, DivisionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!EmployeeId || !(DivisionIds === null || DivisionIds === void 0 ? void 0 : DivisionIds.length)) {
                throw new Error("EmployeeId atau DivisionIds kosong");
            }
            // loop semua division
            for (const divisionId of DivisionIds) {
                yield models_division_1.default.findOneAndUpdate({ _id: divisionId, isDeleted: false }, { $addToSet: { employee_key: EmployeeId } }, // pakai $addToSet biar gak duplikat
                { new: true });
            }
        });
    }
    UpdateEmployeeKeyToDivision(EmployeeId, DivisionIdOld, DivisionIdNew) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!EmployeeId) {
                throw new Error("EmployeeId atau DivisionIds kosong");
            }
            // 3. Hapus employee dari division lama (kalau ada)
            if (DivisionIdOld.length > 0) {
                for (const divisionId of DivisionIdOld) {
                    yield models_division_1.default.findOneAndUpdate({ _id: divisionId, isDeleted: false }, { $pull: { employee_key: EmployeeId } });
                }
            }
            // 4. Tambahkan employee ke division baru
            if (DivisionIdNew.length > 0) {
                for (const divisionId of DivisionIdNew) {
                    yield models_division_1.default.findOneAndUpdate({ _id: divisionId, isDeleted: false }, { $addToSet: { employee_key: EmployeeId } }, // pakai $addToSet biar gak duplikat
                    { new: true });
                }
            }
        });
    }
    UpdateEmployeeOnDivision(status, division_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updateQuery = {};
                if (status === "A" || status === "P") {
                    updateQuery = {
                        $addToSet: { employee_key: employee_id }, // tambah employee_id
                    };
                }
                else if (status === "D") {
                    updateQuery = {
                        $pull: { employee_key: employee_id }, // hapus employee_id
                    };
                }
                else {
                    throw new Error("Status tidak valid");
                }
                const updatedDivision = yield models_division_1.default.findByIdAndUpdate(division_id, updateQuery, { new: true });
                if (!updatedDivision) {
                    throw new Error(`Division not found ${division_id}`);
                }
                return updatedDivision;
            }
            catch (err) {
                console.error("Gagal update Division:", err);
                throw err;
            }
        });
    }
}
exports.DivisionServices = new DivisionService();
