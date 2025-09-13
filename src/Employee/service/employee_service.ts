import Employee from "..";
import EmployeeModel from "../models/employee_models";

class EmployeeService {

//   async KeepRoomBooking(status: string, _id: string) {
//     try {
//       let newStatus: boolean;

//       if (status === "confirmed") {
//         newStatus = false; // kamar dipakai
//       } else if (status === "canceled") {
//         newStatus = true; // kamar dilepas
//       } else {
//         throw new Error("Status tidak valid");
//       }

//       const updatedRoom = await RoomModel.findByIdAndUpdate(
//         _id,
//         { status: newStatus },
//         { new: true }
//       );

//       if (!updatedRoom) {
//         throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
//       }

//       return updatedRoom;
//     } catch (err) {
//       console.error("Gagal update status kamar:", err);
//       throw err;
//     }
//   }


//   async CekRoomAvailable(_id: string){
    
//     try {

//     const RoomStatus = await RoomModel.findOne({ _id, isDeleted: false });
      
//     if (!RoomStatus) {
//         throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
//       }

//     return RoomStatus.status

//     } catch (err) {
//         console.error("Gagal cek status kamar:", err);
//         throw err;
//     }
//   }


// async UpdateDivisionOnEmployee(status: string, division_key: any[], employee_id: string) {
//   try {
//     let updateQuery: any = {};

//     if (status === "A" || status === "P") {
//       updateQuery = {
//         $addToSet: { division_key: { _id: employee_id } }, // tambah employee_id
//       };
//     } else if (status === "D") {
//       updateQuery = {
//         $pull: { division_key: { _id: employee_id } }, // hapus employee_id
//       };
//     } else {
//       throw new Error("Status tidak valid");
//     }

//     const updatedDivision = await EmployeeModel.findByIdAndUpdate(
//       _id,
//       updateQuery,
//       { new: true }
//     );

//     if (!updatedDivision) {
//       throw new Error(`Employee not found ${_id}`);
//     }

//     return updatedDivision;
//   } catch (err) {
//     console.error("Gagal update Employee:", err);
//     throw err;
//   }
// }


}

export const EmployeeServices = new EmployeeService();
