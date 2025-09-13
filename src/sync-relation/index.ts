// Perbaikan fungsi ini harus ada di services/service_employee.js atau controllers/employeeControllers.js

import mongoose from "mongoose";
import DivisionModel from "../Division/models/models_division";
import EmployeeModel from "../Employee/models/employee_models";
import ItemModel from "../Items/models/items_models";

class SyncRelationDataModel {

      // Fungsi untuk menambahkan karyawan ke divisi
  static async addEmployeeToDivision(divisionId: string, employeeId: string) {
    try {
      const updatedDivision = await DivisionModel.findByIdAndUpdate(
        divisionId,
        {
          $addToSet: {
            employee_key: { _id: employeeId }
          }
        },
        { new: true }
      );

      if (!updatedDivision) {
        throw new Error(`Division with ID ${divisionId} not found.`);
      }

      console.log(`Successfully added employee ${employeeId} to division ${divisionId}.`);
      return updatedDivision;
    } catch (err) {
      console.error("Failed to add employee to division:", err);
      throw err;
    }
  }

  // 🔹 Fungsi untuk menghapus karyawan dari divisi
  static async RemoveEmployeeFromDivision(divisionId: string, employeeId: string) {
    try {
      const updatedDivision = await DivisionModel.findByIdAndUpdate(
        divisionId,
        {
          // Menggunakan operator $pull untuk menghapus objek dari array
          $pull: {
            employee_key: { _id: employeeId }
          }
        },
        { new: true } // Mengembalikan dokumen yang telah diperbarui
      );

      if (!updatedDivision) {
        throw new Error(`Division with ID ${divisionId} not found.`);
      }

      console.log(`Successfully removed employee ${employeeId} from division ${divisionId}.`);
      return updatedDivision;

    } catch (err) {
      console.error("Failed to remove employee from division:", err);
      throw err;
    }
  }
  
   async RemoveDivisionFromEmployee(employeeId: string, divisionId : string) {
        try {
            
            const _id = new mongoose.Types.ObjectId(employeeId);

            // Cari dan hapus referensi Divisi dari array division_key di model Employee
            const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
                _id,
                {
                    // Menggunakan operator $pull untuk menghapus objek dari array
                    $pull: {
                        division_key: { _id: divisionId }
                    }
                },
                { new: true } // Mengembalikan dokumen yang telah diperbarui
            );

            if (!updatedEmployee) {
                throw new Error(`Employee with ID ${employeeId} not found.`);
            }

            console.log(`Successfully removed division ${divisionId} from employee ${employeeId}.`);
            return updatedEmployee;

        } catch (err) {
            console.error("Failed to remove division from employee:", err);
            throw err;
        }
    }


   async RemoveDivisionFromItems(itemsId: string) {
        try {

          // Cari dan hapus referensi Divisi dari array division_key di model Employee
            const _id = new mongoose.Types.ObjectId(itemsId);

            const UpdateItem = await ItemModel.findByIdAndUpdate(
                _id,
                {  
                   $unset: { division_key: "" }  // hapus field division_key
                },
                { new: true } // Mengembalikan dokumen yang telah diperbarui
            );

            if (!UpdateItem) {
                throw new Error(`Division with ID ${itemsId} not found.`);
            }

            return UpdateItem;

        } catch (err) {
            console.error("Failed to remove division from employee:", err);
            throw err;
        }
    }

}

export const SyncRelationData = new SyncRelationDataModel();
