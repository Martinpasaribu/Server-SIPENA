
import { v4 as uuidv4 } from 'uuid'; 
import RoomModel, { Facility } from '../models/room_models';
import { Request, Response } from "express";

export class RoomControllers {


        static async PostRoom(req: any, res: any) {
            const { code, price, facility } = req.body;

            try {
                // 1. Validasi input
                if (!code || !price) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: `All fields can't be empty`,
                    success: false,
                });
                }

                // 2. Cek apakah code sudah ada di DB
                const existingRoom = await RoomModel.findOne({ code: code.trim().toUpperCase() });
                if (existingRoom) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "Kode room sudah digunakan, silakan gunakan kode lain.",
                    success: false,
                });
                }

                // 3. Create room
                const newRoom = await RoomModel.create({
                code: code.trim().toUpperCase(),
                price,
                facility: facility
                });

                // 4. Response sukses
                return res.status(201).json({
                requestId: uuidv4(),
                data: newRoom,
                message: "Successfully created room.",
                success: true,
                });
            } catch (error) {
                // 5. Tangkap error
                return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
                });
            }
        }


        static async GetRoom  (req : any , res:any)  {

            try {

                const users = await RoomModel.find({isDeleted:false});
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true
                });
            
            } catch (error) {

                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Internal Server Error",
                success: false
                });

            }
        
        }


        static async DeleteRoom(req: Request, res: Response) {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "ID room tidak boleh kosong",
                success: false,
                });
            }

            try {
                const deleted = await RoomModel.findByIdAndDelete(id);

                if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Room tidak ditemukan",
                    success: false,
                });
                }

                return res.status(200).json({
                requestId: uuidv4(),
                message: "Berhasil menghapus room",
                success: true,
                });
            } catch (error: any) {
                return res.status(500).json({
                requestId: uuidv4(),
                message: error.message || "Terjadi kesalahan server",
                success: false,
                });
            }
        }


        static async GetFacilities(req: Request, res: Response) {
            const { roomId } = req.params;

            try {
                const room = await RoomModel.findById(roomId);

                if (!room) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Room tidak ditemukan",
                        success: false,
                    });
                }

                return res.status(200).json({
                    requestId: uuidv4(),
                    data: room.facility,
                    success: true,
                });
            } catch (error: any) {
                return res.status(500).json({
                    requestId: uuidv4(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        }

        static async UpdateFacilityStatus(req: Request, res: Response) {
            const { roomId, facilityCode } = req.params;
            const { status } = req.body;

            // Validasi status sesuai enum
            const allowedStatus: Facility["status"][] = ["B", "P", "T", "R"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: "Status harus salah satu dari: good, warning, alert",
                    success: false,
                });
            }

            try {
                const updatedRoom = await RoomModel.findOneAndUpdate(
                    { _id: roomId, "facility.code": facilityCode },
                    { $set: { "facility.$.status": status } },
                    { new: true }
                );

                if (!updatedRoom) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Room atau facility tidak ditemukan",
                        success: false,
                    });
                }

                return res.status(200).json({
                    requestId: uuidv4(),
                    message: "Berhasil update status facility",
                    data: updatedRoom.facility,
                    success: true,
                });
            } catch (error: any) {
                return res.status(500).json({
                    requestId: uuidv4(),
                    message: error.message || "Terjadi kesalahan server",
                    success: false,
                });
            }
        }

        // POST tambah facility
        static async AddFacility(req: Request, res: Response) {
            try {
            const { roomId } = req.params;
            const { code, name, status } = req.body;

            if (!code || !name || !status) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "Code, name, dan status wajib diisi",
                success: false,
                });
            }

            const room = await RoomModel.findById(roomId);
            if (!room) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Room tidak ditemukan",
                success: false,
                });
            }

            // cek duplikat
            const exists = room.facility.some(
                (f) => f.code.toUpperCase() === code.toUpperCase()
            );
            if (exists) {
                return res.status(409).json({
                requestId: uuidv4(),
                message: "Facility sudah ada di room ini",
                success: false,
                });
            }

            room.facility.push({
                code: code.toUpperCase(),
                name,
                status,
                image: ''
            });

            await room.save();

            return res.status(201).json({
                requestId: uuidv4(),
                message: "Facility berhasil ditambahkan",
                success: true,
                data: room.facility,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                message: (error as Error).message,
                success: false,
            });
            }
        }


        static async AddImages(req: Request, res: Response) {
            const { code } = req.params;
            const { images } = req.body;
    
            try {
                const updated = await RoomModel.findOneAndUpdate(
                { code, isDeleted: false },
                { $push: { images } },
                { new: true }
                );
    
                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }
    
                return res.status(200).json({
                success: true,
                message: "Image added to gallery successfully",
                data: updated,
                });
            } catch (err: any) {
                res.status(500).json({ success: false, message: err.message });
            }
        }
        
        static async DeletedImages(req: Request, res: Response) {
            const { code } = req.params;
            const { images } = req.body; // isi dengan URL yang mau dihapus
    
            try {
                const updated = await RoomModel.findOneAndUpdate(
                { code, isDeleted: false },
                { $pull: { images } },
                { new: true }
                );
    
                if (!updated) {
                return res.status(404).json({ success: false, message: "Facility not found" });
                }
    
                return res.status(200).json({
                success: true,
                message: "Image removed from gallery successfully",
                data: updated,
                });
            } catch (err: any) {
                res.status(500).json({ success: false, message: err.message });
            }
        }
        


static async UploadFacilityImage(req: Request, res: Response) {
  const { code, facilityId } = req.params;
  const { image } = req.body; // udah diisi di middleware

  try {
    const room = await RoomModel.findOneAndUpdate(
      { code, "facility._id": facilityId },
      { $set: { "facility.$.image": image } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        requestId: uuidv4(),
        message: "Room or facility not found",
        success: false,
      });
    }

    return res.status(200).json({
      requestId: uuidv4(),
      data: room,
      message: "Facility image updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      requestId: uuidv4(),
      message: (error as Error).message,
      success: false,
    });
  }
}

        static async DeleteFacilityImage(req: any, res: any) {
            const { code, facilityId } = req.params;

            try {
            const room = await RoomModel.findOneAndUpdate(
                { code: code, "facility._id": facilityId },
                { $unset: { "facility.$.image": "" } },
                { new: true }
            );

            if (!room) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Room or facility not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: room,
                message: "Facility image deleted successfully",
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                message: (error as Error).message,
                success: false,
            });
            }
        }


        // Sub Data

        static async GetCodeRoom(req: any, res: any) {
            try {
                const rooms = await RoomModel.find(
                    { isDeleted: false }, // filter
                    { code: 1, status: 1}   // projection: ambil hanya `code`, sembunyikan `_id`
                );

                res.status(200).json({
                    requestId: uuidv4(),
                    data: rooms,
                    success: true
                });

            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message || "Internal Server Error",
                    success: false
                });
            }
        }

}