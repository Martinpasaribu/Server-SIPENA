
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import ItemModel from '../models/contact_models';
import DivisionModel from '../../Division/models/models_division';
import mongoose from 'mongoose';
import FacilityModel from '../../Facility/models/facility_models';
import { DivisionServices } from '../../Division/service/service_division';
import { FacilityServices } from '../../Facility/services/service_facility';
import ContactModel from '../models/contact_models';
import { GenerateContactCode } from '../constant';

export class ContactControllers {

        // Baru update
    static async PostContact(req: any, res: any) {
        
        const { name, email, message, phone } = req.body;

        try {
            // 1. Validasi input
            if (!name || !email || !phone ) {
            return res.status(400).json({
                requestId: uuidv4(),
                message: `semua field tidak boleh kosong `,
                success: false,
            });
            }

            // 4. Generate kode item baru
            const generatedCode = await GenerateContactCode(name);

            // 5. Create Item
            const newItem = await ContactModel.create({
                code: generatedCode, // simpan kode item di sini
                name,
                email,
                phone,
                message,
                createdAt: new Date(),
            });

            return res.status(201).json({
                requestId: uuidv4(),
                data: newItem,
                message: "Pesan anda berhasil dikirim",
                success: true,
            });

        } catch (error) {
            
            return res.status(500).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message,
            success: false,
            });
        }
        }
    
    // GET all messages
    static async GetAllContacts(req: Request, res: Response) {
        try {
        // Ambil semua pesan yang belum dihapus
        const messages = await ContactModel.find({ isDeleted: false }).sort({ createdAt: -1 });

        return res.status(200).json({
            requestId: uuidv4(),
            data: messages,
            message: "Berhasil mengambil semua pesan",
            success: true,
        });
        } catch (error) {
        return res.status(500).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message,
            success: false,
        });
        }
    }

    // Optional: GET single message by ID
    static async ContactRead(req: Request, res: Response) {
        const { id } = req.params;

        try {
        const message = await ContactModel.findOneAndUpdate(
            {_id:id},
            {status: "R"}
        );

        if (!message) {
            return res.status(404).json({
            requestId: uuidv4(),
            data: null,
            message: "Pesan tidak ditemukan",
            success: false,
            });
        }

        return res.status(200).json({
            requestId: uuidv4(),
            data: message,
            message: "Berhasil mengambil pesan",
            success: true,
        });
        } catch (error) {
        return res.status(500).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message,
            success: false,
        });
        }
    }

}

