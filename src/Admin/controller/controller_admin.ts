import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from "dotenv";
import AdminModel from "../models/models_admin";
import { Request, Response } from "express";


dotenv.config()

export class AdminController {


    static async  getUser (req : any, res:any) {

        try {
            const users = await AdminModel.find();
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
        }
    }

    static async GetAllAdmin (req : any, res:any) {

        try {
            const users = await AdminModel.find({isDeleted:false});
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
        }
    }

    static async  cekUser (req : any, res:any) {

        try {

            const { email } = req.params;

            const users = await AdminModel.findOne({email: email});

            if(users){
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "User Available.",
                        success: true,
                        data: users
                    }
                );
            }else {
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "User Unavailable.",
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

    static async Register(req: any, res: any) {
        const { user_id, username, email, password, phone, role } = req.body;
    
        try {

            // 1. Cek apakah email sudah terdaftar
            const existingUser = await AdminModel.findOne({ user_id, username, isDeleted:false });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `UserID: ${user_id} atau Username: ${username} sudah terdaftar.`,
                    success: false
                });
            }

            

            // 2. Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    message: "Format email tidak valid.",
                    success: false,
                });
            }

            // 3. Cek apakah email & phone sudah ada
            const existingOrder = await AdminModel.findOne({ email: email, phone, isDelete: false});
            if (existingOrder) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: `Email ${email} atau ${phone} sudah ada, gunakan yang lain.`,
                    success: false,
                });
            }

   
    
            let hashPassword = "";
    
            // 3. Hash password jika ada
            if (password) {
                const salt = await bcrypt.genSalt();
                hashPassword = await bcrypt.hash(password, salt);
            }
    
            // 4. Simpan user ke DB
            const user = await AdminModel.create({
                user_id,
                username,
                email,
                role,
                password: hashPassword || undefined,
                phone
            });
    
            // 5. Respon sukses
            return res.status(201).json({
                requestId: uuidv4(),
                data: user,
                message: "User berhasil didaftarkan.",
                success: true
            });
    
        } catch (error) {
            console.error("Register Error:", error);
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Terjadi kesalahan pada server.",
                success: false
            });
        }
    }

    // Soft delete admin
    static async DeleteAdmin(req: Request, res: Response) {
        const { _id } = req.params;

        if (!_id) {
        return res.status(400).json({
            requestId: uuidv4(),
            success: false,
            message: "ID admin tidak boleh kosong",
        });
        }

        try {
        const admin = await AdminModel.findById(_id);

        if (!admin) {
            return res.status(404).json({
            requestId: uuidv4(),
            success: false,
            message: "Admin tidak ditemukan",
            });
        }

        // Soft delete: ubah isDeleted menjadi true
        admin.isDeleted = true;
        await admin.save();

        return res.status(200).json({
            requestId: uuidv4(),
            success: true,
            message: "Admin berhasil dihapus",
            data: admin,
        });
        } catch (error: any) {
        console.error("❌ Error DeleteAdmin:", error);
        return res.status(500).json({
            requestId: uuidv4(),
            success: false,
            message: "Terjadi kesalahan saat menghapus admin",
            error: error.message,
        });
        }
    }

    static async UpdateAdmin(req: Request, res: Response) {

    const { _id } = req.params;
    const { username, email, user_id, phone, password, role } = req.body;

    if (!_id) {
        return res.status(400).json({ success: false, message: "ID kosong" });
    }

    const oldAdmin = await AdminModel.findById(_id);
    if (!oldAdmin) {
        return res.status(404).json({ success: false, message: "oldAdmin not found" });
    }

    try {
        const updateData: any = {};

        // isi hanya kalau ada datanya
        if (username && username.trim() !== "") updateData.username = username;
        if (email && email.trim() !== "") updateData.email = email;
        if (user_id && user_id.trim() !== "") updateData.user_id = user_id;
        if (role && role.trim() !== "") updateData.role = role;
        if (phone !== undefined && phone !== null && String(phone).trim() !== "") {
            updateData.phone = String(phone).trim();
        }
        if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(password, salt);
        }

            // 1. Cek apakah user_id sudah ada
            const existingUser = await AdminModel.findOne({ user_id: user_id, username: username , isDelete: false });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `UserID: ${user_id} atau Username: ${username} sudah terdaftar.`,
                    success: false
                });
            }

            // 2. Validasi format email
            if(email){
                // 2. Validasi format email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: "Format email tidak valid.",
                        success: false,
                    });
                }
            }

            // 3. Cek apakah email & phone sudah ada
            const existingOrder = await AdminModel.findOne({ email: email, phone , isDelete: false});
            if (existingOrder) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: `Email ${email} atau ${phone} sudah ada, gunakan yang lain.`,
                    success: false,
                });
            }

        const updated = await AdminModel.findOneAndUpdate(
            { _id, isDeleted: false },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updated) {
        return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
        }

        return res.status(200).json({
            success: true,
            message: "Admin berhasil diupdate",
            data: updated
        });

    } catch (err: any) {
        return res.status(500).json({
        success: false,
        message: err.message || "Server error"
        });
    }
    }

    // Update Role Admin
    static async UpdateRole(req: Request, res: Response) {
        try {
        const { _id } = req.params;
        const { role } = req.body;

        if (!_id) {
            return res.status(400).json({ success: false, message: "ID kosong" });
        }

        if (!role) {
            return res.status(400).json({ success: false, message: "Role wajib diisi" });
        }

        // Validasi role
        const validRoles = ["A", "CA", "SA"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Role tidak valid" });
        }

        const updated = await AdminModel.findOneAndUpdate(
            { _id, isDeleted: false },
            { role },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
        }

        return res.status(200).json({
            success: true,
            message: "Role admin berhasil diperbarui",
            data: updated,
        });
        } catch (err: any) {
        return res
            .status(500)
            .json({ success: false, message: err.message || "Server error" });
        }
    }



}