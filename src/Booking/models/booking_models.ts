import mongoose from 'mongoose';
import { Room } from '../../Room/models/room_models';
import { ref } from 'process';



interface IBooking extends Document{
  _id: string;
  username: string;
  room_key: Room;
  phone: number;
  email: string;
  booking_date: Date;
  status:string;
}

const BookingSchema = new mongoose.Schema({

    username: { type: String, unique: true, required: false },
    room_key: { 
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'Room'
     },
    phone: { type: Number, required: true },
    email: { type: String, default: ""},
    booking_date: { type: Date, required: false },
    status: { type: String, default:'pending', enum:["pending" , "confirmed" , "canceled"], required: false },
    
    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  BookingModel = mongoose.model<IBooking>('Booking', BookingSchema,'Booking');

export default BookingModel;
