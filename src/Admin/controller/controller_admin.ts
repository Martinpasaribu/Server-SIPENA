import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from "dotenv";
import AdminModel from "../models/models_admin";


dotenv.config()

export class UserController {


    static async  getUser (req : any, res:any) {

        try {
            const users = await AdminModel.find();
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
        const { user_id, name, email, password, phone, role } = req.body;
    
        try {

            // 1. Cek apakah email sudah terdaftar
            const existingUser = await AdminModel.findOne({ user_id,email });
            if (existingUser) {
                return res.status(400).json({
                    requestId: uuidv4(),
                    data: null,
                    message: `UserID ${email} sudah terdaftar.`,
                    success: false
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
                name,
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
    

}