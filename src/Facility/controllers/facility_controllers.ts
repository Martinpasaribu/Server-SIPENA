
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import FacilityModel from '../models/facility_models';

export class FacilityControllers {


        static async PostFacility(req: any, res: any) {

            const { name, code, unit, data_before, data_after, category, desc } = req.body;

            try {

                // 1. Validasi input
                if (!name || !code || !unit || !unit || !data_before || !data_after || !desc) {
                return res.status(400).json({
                    requestId: uuidv4(),
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
                const newRoom = await FacilityModel.create({

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
                    requestId: uuidv4(),
                    data: newRoom,
                    message: "Successfully created facility.",
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

        static async GetFacility  (req : any , res:any)  {

            try {

                const users = await FacilityModel.find({isDeleted:false});
                
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

        static async CekFacility (req : any, res:any) {
    
            try {
    
                const { email } = req.params;
    
                const users = await FacilityModel.findOne({email: email});
    
                if(users){
                    res.status(200).json(
                        {
                            requestId: uuidv4(), 
                            message: "Division Available.",
                            success: true,
                            data: users
                        }
                    );
                }else {
                    res.status(200).json(
                        {
                            requestId: uuidv4(), 
                            message: "Division Unavailable.",
                            success: false,
                            data: users
                        }
                    );
                }
    
            } catch (error) {
                res.status(400).json(
                    {
                        requestId: uuidv4(), 
                        data: null,
                        message:  (error as Error).message,
                        success: false
                    }
                );
            }
        }
    
        static async UpdateFacility(req: any, res: any) {

            try {

                const { _id } = req.params; // Ambil _id dari parameter URL
                const { name, desc, status, data_before, data_after, unit  } = req.body; // Ambil data yang akan diperbarui dari body
    
                if (!_id) {
                    return res.status(400).json({
                        message: "Division ID is required.",
                        success: false
                    });
                }
    
                const updatedDivision = await FacilityModel.findByIdAndUpdate(
                    _id,
                    { name, desc, status, data_after, data_before, unit },
                    { new: true } // Mengembalikan dokumen yang diperbarui
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
    
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error.",
                    success: false
                });
            }
        }

        static async DeletedFacility(req: Request, res: Response) {
            const { _id } = req.params;
    
            if (!_id) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "ID Division tidak boleh kosong",
                success: false,
                });
            }
    
            try {
                
                const deleted = await FacilityModel.findByIdAndDelete(_id);
    
                if (!deleted) {
                    return res.status(404).json({
                        requestId: uuidv4(),
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
                    requestId: uuidv4(),
                    message: "Berhasil menghapus employee",
                    // UpdateRoom: UpdateRoom,
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
    
            const { _id } = req.params;
            const { status } = req.body;
    
            if (status === null) {
                return res.status(400).json({
                success: false,
                message: "Status harus diisi",
                });
            }
    
            try {
                const updated = await FacilityModel.findOneAndUpdate(
                    { _id, isDeleted: false },
                    { status },
                    { new: true, runValidators: true }
                );
    
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
    
            } catch (err: any) {
                return res.status(500).json({
                success: false,
                message: err.message || "Server error",
                });
            }
        }

        static async AddImage(req: Request, res: Response) {
        const { code } = req.params;
        const { image } = req.body;

        try {
            const updated = await FacilityModel.findOneAndUpdate(
            { code, isDeleted: false },
            { image },
            { new: true }
            );

            if (!updated) {
            return res.status(404).json({ success: false, message: "Facility not found" });
            }

            return res.status(200).json({
            success: true,
            message: "Main image updated successfully",
            data: updated,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
        }

        static async AddImageIRepair(req: Request, res: Response) {
            const { code } = req.params;
            const { image_irepair } = req.body;

            try {
                const updated = await FacilityModel.findOneAndUpdate(
                    { code, isDeleted: false },
                    { image_IRepair: image_irepair },
                    { new: true }
                );

                if (!updated) {
                    return res.status(404).json({ success: false, message: "Facility not found" });
                }

                return res.status(200).json({
                    success: true,
                    message: "image invoice repair updated successfully",
                    data: updated,
                });
            } catch (err: any) {
                res.status(500).json({ success: false, message: err.message });
            }
        }

        static async AddImages(req: Request, res: Response) {
        const { code } = req.params;
        const { images } = req.body;

        try {
            const updated = await FacilityModel.findOneAndUpdate(
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
            const updated = await FacilityModel.findOneAndUpdate(
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

        // Sub Data

        static async GetCodeFacility(req: any, res: any) {
            
            try {

                const division = await FacilityModel.find(
                    { isDeleted: false }, // filter
                    { code: 1, status:1, _id:1}   // projection: ambil hanya `code`, sembunyikan `_id`
                );
    
                res.status(200).json({
                    requestId: uuidv4(),
                    data: division,
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

        static async GetCodeFacilityById(req: any, res: any) {
            
            const { category_id } = req.params

            try {

                const division = await FacilityModel.find(
                    {category: category_id },
                    { isDeleted: false }, // filter
                    { code: 1, status:1, _id:1}   // projection: ambil hanya `code`, sembunyikan `_id`
                );
    
                res.status(200).json({
                    requestId: uuidv4(),
                    data: division,
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