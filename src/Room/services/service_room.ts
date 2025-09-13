import RoomModel from "../models/room_models";

class RoomService {

  async KeepRoomBooking(status: string, _id: string) {
    try {
      let newStatus: boolean;

      if (status === "confirmed") {
        newStatus = false; // kamar dipakai
      } else if (status === "canceled") {
        newStatus = true; // kamar dilepas
      } else {
        throw new Error("Status tidak valid");
      }

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        _id,
        { status: newStatus },
        { new: true }
      );

      if (!updatedRoom) {
        throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
      }

      return updatedRoom;
    } catch (err) {
      console.error("Gagal update status kamar:", err);
      throw err;
    }
  }


  async CekRoomAvailable(_id: string){
    
    try {

    const RoomStatus = await RoomModel.findOne({ _id, isDeleted: false });
      
    if (!RoomStatus) {
        throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
      }

    return RoomStatus.status

    } catch (err) {
        console.error("Gagal cek status kamar:", err);
        throw err;
    }
  }

  async UpdateStatusRoom(status: string, _id: string) {
    try {
      let newStatus: boolean;

      if (status === "M" || status === "P") {
        newStatus = false; // kamar dipakai
      } else if (status === "K") {
        newStatus = true; // kamar dilepas
      } else {
        throw new Error("Status tidak valid");
      }

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        _id,
        { status: newStatus },
        { new: true }
      );

      if (!updatedRoom) {
        throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
      }

      return updatedRoom;
    } catch (err) {
      console.error("Gagal update status kamar:", err);
      throw err;
    }
  }


}

export const RoomServices = new RoomService();
