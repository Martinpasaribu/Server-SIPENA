import { Employee } from "../../Employee/models/employee_models";
import DivisionModel from "../models/models_division";

class DivisionService {

  async DelItemsKeyToDivision(ItemsId: string, DivisionId: string) {
    
    if (!ItemsId && !DivisionId) {
      throw new Error("ItemsIdId & DivisionId Kosong");
    }

    await DivisionModel.findOneAndUpdate(
      { _id: DivisionId, isDeleted: false },
      { $pull: { item_key: { _id: ItemsId }} }, // pakai $addToSet biar gak duplikat
      { new: true }
    );

    console.log(' data 1',ItemsId)
    console.log(' data 2',DivisionId)
  }

  async DelEmployeeKeyToDivision(EmployeeId: string, DivisionId: string[]) {
    
    if (!EmployeeId && !DivisionId) {
      throw new Error("ItemsIdId & DivisionId Kosong");
    }

    if (DivisionId.length > 0) {
      for (const divisionId of DivisionId) {
        await DivisionModel.findOneAndUpdate(
        { _id: divisionId, isDeleted: false },
        { $pull: { employee_key: { _id : EmployeeId } } }
        );
      }
    }

    console.log(' data 1',EmployeeId)
    console.log(' data 2',DivisionId)
  }
  
  
  async AddEmployeeKeyToDivision(EmployeeId: string, DivisionIds: string[]) {
    if (!EmployeeId || !DivisionIds?.length) {
      throw new Error("EmployeeId atau DivisionIds kosong");
    }

    // loop semua division
    for (const divisionId of DivisionIds) {
      await DivisionModel.findOneAndUpdate(
        { _id: divisionId, isDeleted: false },
        { $addToSet: { employee_key: { _id: EmployeeId }} }, // pakai $addToSet biar gak duplikat
        { new: true }
      );
    }
  }
  
  async UpdateEmployeeKeyToDivision(EmployeeId: string, DivisionIdOld: string[], DivisionIdNew: string[]) {
    
    if (!EmployeeId ) {
      throw new Error("EmployeeId atau DivisionIds kosong");
    }

    // 3. Hapus employee dari division lama (kalau ada)
    if (DivisionIdOld.length > 0) {
      for (const divisionId of DivisionIdOld) {
        await DivisionModel.findOneAndUpdate(
        { _id: divisionId, isDeleted: false },
        { $pull: { employee_key: { _id : EmployeeId } } }
        );
      }
    }

    // 4. Tambahkan employee ke division baru
    if (DivisionIdNew.length > 0) {
      for (const divisionId of DivisionIdNew) {
        await DivisionModel.findOneAndUpdate(
        { _id: divisionId, isDeleted: false },
        { $addToSet: { employee_key: { _id : EmployeeId } } }, // pakai $addToSet biar gak duplikat
        { new: true }
        );
      }
    }



  }



  async UpdateEmployeeOnDivision(status: string, division_id: string, employee_id: string) {
    try {
      let updateQuery: any = {};

      if (status === "A" || status === "P") {
        updateQuery = {
          $addToSet: { employee_key: { _id: employee_id } }, // tambah employee_id
        };
      } else if (status === "D") {
        updateQuery = {
          $pull: { employee_key: { _id: employee_id } }, // hapus employee_id
        };
      } else {
        throw new Error("Status tidak valid");
      }

      const updatedDivision = await DivisionModel.findByIdAndUpdate(
        division_id,
        updateQuery,
        { new: true }
      );

      if (!updatedDivision) {
        throw new Error(`Division not found ${division_id}`);
      }

      return updatedDivision;
    } catch (err) {
      console.error("Gagal update Division:", err);
      throw err;
    }
  }


}

export const DivisionServices = new DivisionService();
