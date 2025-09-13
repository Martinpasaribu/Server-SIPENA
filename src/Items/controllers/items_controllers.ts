
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import ItemModel from '../models/items_models';
import DivisionModel from '../../Division/models/models_division';
import mongoose from 'mongoose';
import FacilityModel from '../../Facility/models/facility_models';
import { DivisionServices } from '../../Division/service/service_division';

export class ItemsControllers {


        static async PostItems(req: any, res: any) {

            const { name, nup, desc, division_key, status } = req.body;
            const { facility_key } = req.params

            try {

                // 1. Validasi input

                if (!name || !facility_key || !nup  || !desc || !division_key) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: ` All fields can't be empty `,
                        success: false,
                    });
                }

                // 2. Cek apakah code sudah ada di DB


                const facilityFind = await FacilityModel.findOne(
                    { _id:facility_key, isDeleted: false }
                );

                if (!facilityFind) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Facility tidak tersedia",
                        facilityFind,
                        success: false,
                    });
                }


                // 2. Cek apakah code sudah ada di DB
                const existingRoom = await ItemModel.findOne({ nup: nup });
                
                if (existingRoom) {

                    return res.status(409).json({
                        requestId: uuidv4(),
                        message: " NUP sudah digunakan ",
                        success: false,
                    });

                }

                // 3. Cek apakah code sudah ada di DB
                const division = await DivisionModel.findOne({ _id:division_key, status: false });
                
                if (division) {

                    return res.status(409).json({
                        requestId: uuidv4(),
                        message: " division yang dipilih sudah tidak aktif ", 
                        division,
                        existingRoom,
                        success: false,
                    });

                }

                // 3. Create room
                const newItem = await ItemModel.create({

                    name,
                    facility_key,
                    division_key,
                    nup,
                    desc,
                    status,

                });

                // ✅ Update Division -> tambahkan item ke division yang dipilih
                await DivisionModel.findOneAndUpdate(
                    { _id: division_key, isDeleted: false },
                    { 
                        $push: { item_key: { _id: newItem._id } }, // masukkan id item baru
                    },
                    { new: true }
                );


                const facility = await FacilityModel.findOneAndUpdate(
                    { _id:facility_key, isDeleted: false },
                    { $inc: { qty: 1 } },
                    { new: true } // ✅ return document setelah update
                );

                if (!facility) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Facility tidak tersedia",
                        facility,
                        success: false,
                    });
                }

                // 4. Response sukses
                return res.status(201).json({
                    requestId: uuidv4(),
                    data: newItem,
                    message: " Successfully created items ",
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

        static async GetItems (req : any , res:any)  {

            try {

                const Items = await ItemModel.find({ isDeleted:false }).populate('division_key');
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: Items,
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

        static async GetItemsFacility (req : any , res:any)  {

            const { _id } = req.params
            try {

                const Items = await ItemModel.find({ facility_key:_id, isDeleted:false }).populate('division_key');
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: Items,
                    success: true,
                    message: 'Success Fetch data items facility'
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

        static async CekItems(req : any, res:any) {
    
            try {
    
                const { nup } = req.params;
    
                const users = await ItemModel.findOne({nup: nup});
    
                if(users){

                    res.status(200).json(
                        {
                            requestId: uuidv4(), 
                            message: "Items Available.",
                            success: true,
                            data: users
                        }
                    );

                }else {
                    res.status(200).json(
                        {
                            requestId: uuidv4(), 
                            message: "Items Unavailable.",
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
    
        static async UpdateItems(req: any, res: any) {

            try {
                const { _id } = req.params; // Ambil _id dari parameter URL
                const { name, nup, desc, division_key, qty, status  } = req.body; // Ambil data yang akan diperbarui dari body
    
                if (!_id) {
                    return res.status(400).json({
                        message: "Items ID is required.",
                        success: false
                    });
                }
    
                  // 1. Cari item lama untuk tahu division lama
                const oldItem = await ItemModel.findById(_id);
              
                if (!oldItem) {
                    return res.status(404).json({ success: false, message: "Item not found" });
                }
                
                const oldDivisionKey = oldItem.division_key;

                // 👇 kalau division_key kosong, ubah ke null
                const safeDivisionKey = division_key && division_key !== "" ? division_key : null;

                const updatedItem = await ItemModel.findByIdAndUpdate(
                    _id,
                    { name, desc, status, nup, division_key: safeDivisionKey, qty },
                    { new: true }
                );

                if (!updatedItem) {
                    return res.status(404).json({ success: false, message: "Item not found" });
                }
                

                // 3. Hapus item dari division lama (kalau ada)
                if (oldDivisionKey) {
                    await DivisionModel.findOneAndUpdate(
                    { _id: oldDivisionKey, isDeleted: false },
                    { $pull: { item_key: { _id : updatedItem._id } } }
                    );
                }

                // 4. Tambahkan item ke division baru
                if (division_key) {
                    await DivisionModel.findOneAndUpdate(
                    { _id: division_key, isDeleted: false },
                    { $addToSet: { item_key: { _id : updatedItem._id } } }, // pakai $addToSet biar gak duplikat
                    { new: true }
                    );
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
    
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error.",
                    success: false
                });
            }
        }

        static async DeletedItems(req: Request, res: Response) {

            const { _id } = req.params;
    
            if (!_id) {
                    return res.status(400).json({
                    requestId: uuidv4(),
                    message: "ID Items tidak boleh kosong",
                    success: false,
                });
            }
    
            try {
                
                // const deleted = await ItemModel.findByIdAndDelete(_id);
    
                const deleted = await ItemModel.findByIdAndUpdate(
                _id,
                { isDeleted: true },
                { new: true }
                );


                if (!deleted) {
                    return res.status(404).json({
                        requestId: uuidv4(),
                        message: "Items tidak ditemukan",
                        success: false,
                    });
                }

                // ambil _id facility dari item yang dihapus
                const facilityId = deleted.facility_key;  

                const UpdateItems = await FacilityModel.findOneAndUpdate(
                    { _id: facilityId },
                    { $inc: { qty: -1 } },  // kurangi qty sebanyak 1
                    { new: true }          // kembalikan dokumen terbaru
                );

                await DivisionServices.DelItemsKeyToDivision(deleted._id, deleted.division_key);
                    
                return res.status(200).json({
                    requestId: uuidv4(),
                    message: "Berhasil menghapus Items",
                    UpdateItems,
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
    
        static async UpdateItemsStatus(req: Request, res: Response) {
    
            const { _id } = req.params;
            const { status } = req.body;
    
            if (status === null) {
                return res.status(400).json({
                    success: false,
                    message: "Status Items harus di isi",
                });
            }
    
            try {

                const updated = await ItemModel.findOneAndUpdate(
                    { _id, isDeleted: false },
                    { status },
                    { new: true, runValidators: true }
                );
    
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
}