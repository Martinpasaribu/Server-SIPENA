"use strict";
// Perbaikan fungsi ini harus ada di services/service_employee.js atau controllers/employeeControllers.js
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
exports.SyncRelationData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_division_1 = __importDefault(require("../Division/models/models_division"));
const employee_models_1 = __importDefault(require("../Employee/models/employee_models"));
const items_models_1 = __importDefault(require("../Items/models/items_models"));
class SyncRelationDataModel {
    // Fungsi untuk menambahkan karyawan ke divisi
    static addEmployeeToDivision(divisionId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDivision = yield models_division_1.default.findByIdAndUpdate(divisionId, {
                    $addToSet: {
                        employee_key: employeeId
                    }
                }, { new: true });
                if (!updatedDivision) {
                    throw new Error(`Division with ID ${divisionId} not found.`);
                }
                console.log(`Successfully added employee ${employeeId} to division ${divisionId}.`);
                return updatedDivision;
            }
            catch (err) {
                console.error("Failed to add employee to division:", err);
                throw err;
            }
        });
    }
    // 🔹 Fungsi untuk menghapus karyawan dari divisi
    static RemoveEmployeeFromDivision(divisionId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDivision = yield models_division_1.default.findByIdAndUpdate(divisionId, {
                    // Menggunakan operator $pull untuk menghapus objek dari array
                    $pull: {
                        employee_key: employeeId
                    }
                }, { new: true } // Mengembalikan dokumen yang telah diperbarui
                );
                if (!updatedDivision) {
                    throw new Error(`Division with ID ${divisionId} not found.`);
                }
                console.log(`Successfully removed employee ${employeeId} from division ${divisionId}.`);
                return updatedDivision;
            }
            catch (err) {
                console.error("Failed to remove employee from division:", err);
                throw err;
            }
        });
    }
    RemoveDivisionFromEmployee(employeeId, divisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.default.Types.ObjectId(employeeId);
                // Cari dan hapus referensi Divisi dari array division_key di model Employee
                const updatedEmployee = yield employee_models_1.default.findByIdAndUpdate(_id, {
                    // Menggunakan operator $pull untuk menghapus objek dari array
                    $pull: {
                        division_key: divisionId
                    }
                }, { new: true } // Mengembalikan dokumen yang telah diperbarui
                );
                if (!updatedEmployee) {
                    throw new Error(`Employee with ID ${employeeId} not found.`);
                }
                console.log(`Successfully removed division ${divisionId} from employee ${employeeId}.`);
                return updatedEmployee;
            }
            catch (err) {
                console.error("Failed to remove division from employee:", err);
                throw err;
            }
        });
    }
    RemoveDivisionFromItems(itemsId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Cari dan hapus referensi Divisi dari array division_key di model Employee
                const _id = new mongoose_1.default.Types.ObjectId(itemsId);
                const UpdateItem = yield items_models_1.default.findByIdAndUpdate(_id, {
                    $unset: { division_key: "" } // hapus field division_key
                }, { new: true } // Mengembalikan dokumen yang telah diperbarui
                );
                if (!UpdateItem) {
                    throw new Error(`Division with ID ${itemsId} not found.`);
                }
                return UpdateItem;
            }
            catch (err) {
                console.error("Failed to remove division from employee:", err);
                throw err;
            }
        });
    }
}
exports.SyncRelationData = new SyncRelationDataModel();
