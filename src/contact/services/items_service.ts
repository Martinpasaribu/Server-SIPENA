
class ItemsService {



//   async DeletedDivisionOnItems(_id: string){
    
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



}

export const ItemsServices = new ItemsService();
