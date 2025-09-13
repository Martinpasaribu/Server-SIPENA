
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import OrderModel from '../models/booking_models';
import RoomModel from '../../Room/models/room_models';
import BookingModel from '../models/booking_models';
import { RoomServices } from '../../Room/services/service_room';

export class BookingControllers {


        static async PostBooking(req: any, res: any) {
            const { username, email, room_key, booking_date, phone } = req.body;

            try {
                // 1. Validasi input kosong
                if (!username || !email || !room_key || !phone || !booking_date) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: `All fields can't be empty`,
                        success: false,
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


                const RoomStatus = await RoomServices.CekRoomAvailable(room_key);
                if (RoomStatus === false) {
                    return res.status(409).json({
                        requestId: uuidv4(),
                        message: "Room yang dipilih tidak tersedia",
                        success: false,
                    });
                }

                // 3. Cek apakah email & phone sudah ada
                const existingOrder = await BookingModel.findOne({ email: email, phone: phone });
                if (existingOrder) {
                    return res.status(409).json({
                        requestId: uuidv4(),
                        message: "Email atau no telepon sudah ada, gunakan yang lain.",
                        success: false,
                    });
                }


                // 4. Simpan order
                const newOrder = await BookingModel.create({
                    email,
                    phone,
                    username,
                    booking_date,
                    room_key,
                });

                // 5. Respon sukses
                return res.status(201).json({
                    requestId: uuidv4(),
                    data: newOrder,
                    message: "Successfully add Booking.",
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


        static async GetBooking  (req : any , res:any)  {

            try {

                const booking = await BookingModel.find({isDeleted:false}).populate('room_key');
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: booking,
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


        static async DeleteBooking(req: Request, res: Response) {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                requestId: uuidv4(),
                message: "ID Booking tidak boleh kosong",
                success: false,
                });
            }

            try {
                const deleted = await BookingModel.findByIdAndDelete(id);

                if (!deleted) {
                return res.status(404).json({
                    requestId: uuidv4(),
                    message: "Booking tidak ditemukan",
                    success: false,
                });
                }

                return res.status(200).json({
                    requestId: uuidv4(),
                    message: "Berhasil menghapus booking",
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


        static async UpdateBookingStatus(req: Request, res: Response) {
            try {
            const { id, room_key } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Status is required" });
            }

            const updatedBooking = await BookingModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!updatedBooking) {
                return res.status(404).json({ message: "Booking not found" });
                }

            const updateRoom = await RoomServices.KeepRoomBooking(status, room_key);


            if (!updatedBooking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            res.status(200).json({
                message: "Booking status updated successfully",
                data: updatedBooking,
                updateRoom: updateRoom,
            });
            } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            }
        }



        // Sub Data

        static async GetCodeRoom(req: any, res: any) {
            try {
                const rooms = await RoomModel.find(
                    { isDeleted: false }, // filter
                    { code: 1}   // projection: ambil hanya `code`, sembunyikan `_id`
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