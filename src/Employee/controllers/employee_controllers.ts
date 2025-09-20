import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from "dotenv";
import CustomerModel from "../models/employee_models";
import crypto from "crypto";
import { Request, Response } from "express";
import EmployeeModel from "../models/employee_models";
import { DivisionServices } from "../../Division/service/service_division";

dotenv.config()

export class EmployeeController {


    static async  GetEmployee (req : any, res:any) {

        try {

            const customer = await EmployeeModel.find({isDeleted: false}).populate({
                path: "division_key", // masuk ke field dalam array
                model: "Division",        // pastikan model Division sudah didefinisikan
            });
            
            res.status(200).json(
            {
                requestId: uuidv4(), 
                message: "Data Employee.",
                success: false,
                data: customer
            }

        );
        } catch (error) {
            console.log(error);
        }
    }

    static async  CekEmployee (req : any, res:any) {

        try {

            const { _id } = req.params;

            const users = await CustomerModel.findOne({user_id: _id});

            if(users){
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "Employee Available.",
                        success: true,
                        data: users
                    }
                );
            }else {
                res.status(200).json(
                    {
                        requestId: uuidv4(), 
                        message: "Employee Unavailable.",
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


    static async CreateEmployee(req: any, res: any) {
        const {  username, email, password, phone, role, division_key} = req.body;

        try {
            // Generate user_id: 4 karakter acak + username
            const randomCode = crypto.randomBytes(1).toString("hex").toUpperCase(); // 4 hex char
            const user_id = `${username}${randomCode}`;

            const required = ["username", "email","role", "phone"];

            // Cari field kosong
            for (const field of required) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: `${field} tidak boleh kosong`,
                        success: false,
                    });
                }
            }

            // 1. Cek apakah user_id sudah ada
            const existingUser = await EmployeeModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `Username ${username} sudah terdaftar.`,
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
            const existingOrder = await EmployeeModel.findOne({ email: email, phone: phone });
            if (existingOrder) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "Email atau no telepon sudah ada, gunakan yang lain.",
                    success: false,
                });
            }


            // 3. Hash password jika ada
            let hashPassword = "";
            if (password) {
                const salt = await bcrypt.genSalt();
                hashPassword = await bcrypt.hash(password, salt);
            }

            // 4. Simpan user
            const user = await EmployeeModel.create({
                user_id,
                username,
                phone,
                role,
                status:'P',
                email,
                division_key: division_key.map((id: string) => ({ _id: id })), 
                password: hashPassword || undefined,
            });

            if (!user) {
                return res.status(409).json({
                    requestId: uuidv4(),
                    message: "User tidak ditemukan",
                    success: false,
                });
            }

            await DivisionServices.AddEmployeeKeyToDivision(user._id, division_key)

            // 6. Respon sukses
            return res.status(201).json({
                requestId: uuidv4(),
                data: user,
                message: "Employee berhasil didaftarkan.",
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

    static async UpdateEmployee(req: Request, res: Response) {
    
        const { _id } = req.params;
        const { password, ...data } = req.body; // pisahkan password dari field lain

        if (!_id) {
            return res.status(400).json({ success: false, message: "ID kosong" });
        }

        const oldEmployee = await EmployeeModel.findById(_id);
        
        if (!oldEmployee) {
            return res.status(404).json({ success: false, message: "oldEmployee not found" });
        }

        try {
            // Hash password jika ada
            if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
            }

            const updated = await EmployeeModel.findOneAndUpdate(
            { _id, isDeleted: false },
            data,
            { new: true, runValidators: true }
            );

            if (!updated) {
                return res.status(404).json({ success: false, message: "Employee tidak ditemukan" });
            }

            function normalizeDivisionKey(raw: any): string[] {
                if (!raw) return [];
                return raw.map((d: any) => (typeof d === "string" ? d : d._id?.toString() || "")).filter(Boolean);
            }
            const oldDivisionIds = normalizeDivisionKey(oldEmployee.division_key);
            const newDivisionIds = normalizeDivisionKey(data.division_key);


            const isSame =
            oldDivisionIds.length === newDivisionIds.length &&
            oldDivisionIds.every((id: any) => newDivisionIds.includes(id));

            if (!isSame) {
                await DivisionServices.UpdateEmployeeKeyToDivision(_id, oldDivisionIds, newDivisionIds);
            }


            return res.status(200).json({ success: true, message: "Employee berhasil diupdate", data: updated });
            
        } catch (err: any) {

            return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
    }


    static async DeletedEmployee(req: Request, res: Response) {
        const { _id } = req.params;

        if (!_id) {
            return res.status(400).json({
            requestId: uuidv4(),
            message: "ID Employee tidak boleh kosong",
            success: false,
            });
        }

        try {
            
            // const deleted = await EmployeeModel.findByIdAndDelete(_id);

            const deleted = await EmployeeModel.findByIdAndUpdate(
                _id,
                { isDeleted: true },
                { new: true }
            );

            if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Employee tidak ditemukan",
                    success: false,
                });
            }

            function normalizeDivisionKey(raw: any): string[] {
                if (!raw) return [];
                return raw.map((d: any) => (typeof d === "string" ? d : d._id?.toString() || "")).filter(Boolean);
            }
            
            const DivisionId = normalizeDivisionKey(deleted.division_key);

            await DivisionServices.DelEmployeeKeyToDivision(deleted._id, DivisionId);
                    

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


    static async UpdateEmployeeStatus(req: Request, res: Response) {

        const { _id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
            success: false,
            message: "Status harus diisi",
            });
        }

        try {
            const updated = await EmployeeModel.findOneAndUpdate(
                { _id, isDeleted: false },
                { status },
                { new: true, runValidators: true }
            );

            if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Facility tidak ditemukan",
            });
            }

            return res.status(200).json({
                success: true,
                message: "Status berhasil diupdate",
                data: updated,
            });
        } catch (err: any) {
            return res.status(500).json({
            success: false,
            message: err.message || "Server error",
            });
        }
    }
    

}