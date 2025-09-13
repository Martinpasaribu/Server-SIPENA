import mongoose, { Document } from "mongoose";

export interface Facility {
  name: string;
  code: string;
  status: "B" | "P" | "T" | "R";
  image: string;
}

export interface Room{
    name: string,
    code: string,
    price: number,
    facility: Facility[],
    status: boolean,
    customer_key: string,
    report_id: string,
    images: string[];
}


interface IRoom extends Document{
    name: string,
    code: string,
    price: number,
    facility: Facility[],
    status: boolean,
    customer_key: string,
    report_id: string,
    images: string[];
}

const RoomSchema = new mongoose.Schema({

    customer_key: {             
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        // default: '', 
        required: false 
    },

    name: { type: String, required: false },
    code: { type: String, unique: true, required: true },
    
    facility: [
        { 
            name: {  type: String, required: false,trim: true },
            code: {  type: String, required: false,trim: true },
            status: {               // Kategori metode pembayaran
                type: String,
                enum: ["B", "P", "T", "R"],
            },
            image: {
                type: String, 
                default: "", 
                required: false
            }
          }
       
    ],
    price: { type: Number, required: true },
    status: { type: Boolean, default: true},
    report_id: { type: String, default: '', required: false },
    
    images: [{ type: String }],
    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  RoomModel = mongoose.model<IRoom>('Room', RoomSchema,'Room');

export default RoomModel;
