import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from "dotenv";
import DivisionModel from "../models/models_division";
import { Request, Response } from "express";
import { SyncRelationData } from "../../sync-relation";

dotenv.config()

export class DivisionControllers {


    static async  GetDivision (req : any, res:any) {

        try {
            const Division = await DivisionModel.find({isDeleted:false});
      
            res.status(200).json(
                {
                    requestId: uuidv4(), 
                    message: "Division Available.",
                    success: true,
                    data: Division
                }
            );

        } catch (error) {
            console.log(error);
        }
    }

    static async CreateDivision(req: any, res: any) {
        const { name, code, desc } = req.body;
    
        try {

            // 1. Cek apakah user_id sudah ada
            const existingUser = await DivisionModel.findOne({ code });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `${code} sudah terdaftar.`,
                    success: false
                });
            }

            // 4. Simpan user ke DB
            const user = await DivisionModel.create({
                name,
                code,
                desc
            });
    
            // 5. Respon sukses
            return res.status(201).json({
                requestId: uuidv4(),
                data: user,
                message: "Divisi berhasil didaftarkan.",
                success: true
            });
    
        } catch (error) {
            console.error("Divisi Error:", error);
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Terjadi kesalahan pada server.",
                success: false
            });
        }
    }

    static async  CekDivision (req : any, res:any) {

        try {

            const { email } = req.params;

            const users = await DivisionModel.findOne({email: email});

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


    static async UpdateDivision(req: any, res: any) {
        try {
            const { _id } = req.params; // Ambil _id dari parameter URL
            const { name, desc, status } = req.body; // Ambil data yang akan diperbarui dari body

            if (!_id) {
                return res.status(400).json({
                    message: "Division ID is required.",
                    success: false
                });
            }

            const updatedDivision = await DivisionModel.findByIdAndUpdate(
                _id,
                { name, desc, status },
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


    static async DeletedDivision(req: Request, res: Response) {
        const { _id } = req.params;

        if (!_id) {
            return res.status(400).json({
            requestId: uuidv4(),
            message: "ID Division tidak boleh kosong",
            success: false,
            });
        }

        try {
            const deleted = await DivisionModel.findByIdAndUpdate(
            _id,
            { isDeleted: true },
            { new: true }
            );

            if (!deleted) {
            return res.status(404).json({
                requestId: uuidv4(),
                message: "Division tidak ditemukan",
                success: false,
            });
            }

            // 🔹 Hapus referensi Divisi dari relasi Employee 
            if (deleted.employee_key.length > 0 ) {


                const employeeKeys = deleted.employee_key.map((itm: any) => itm._id.toString());

                
                await Promise.all(
                    employeeKeys.map((employeeId) =>
                        SyncRelationData.RemoveDivisionFromEmployee(
                        employeeId,
                        deleted._id
                        )
                    )
                );

            }

            // 🔹 Hapus referensi Divisi dari Item
            if ( deleted.item_key.length > 0) {

                
                // const itemKeys = deleted.item_key.map(itm => itm._id.toString());
                const itemKeys = deleted.item_key.map((itm: any) => itm._id.toString());

                await Promise.all(
                    itemKeys.map((itemId) =>
                        SyncRelationData.RemoveDivisionFromItems(
                        itemId
                        )
                    )
                );

            }

            return res.status(200).json({
            requestId: uuidv4(),
            message: `Division ${deleted.name} berhasil dihapus`,
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


    static async UpdateDivisionStatus(req: Request, res: Response) {

        const { _id } = req.params;
        const { status } = req.body;

        if (status === null) {
            return res.status(400).json({
            success: false,
            message: "Status harus diisi",
            });
        }

        try {
            const updated = await DivisionModel.findOneAndUpdate(
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
    

    // Sub Controller

    static async GetCodeDivision(req: any, res: any) {
        try {
            const division = await DivisionModel.find(
                { isDeleted: false }, // filter
                { code: 1, status:1, _id:1, name:1}   // projection: ambil hanya `code`, sembunyikan `_id`
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