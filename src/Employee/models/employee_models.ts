import mongoose, { Document, Schema } from 'mongoose';

// Basic

interface Division {
    _id: string
}

export interface Employee  {

    _id: string;
    status: 'A' | 'B' | 'P';
    division_key: Division[];
    user_id : string
    username : string;
    password: string;
    email : string;
    phone : number;
    role: 'E' | 'H1' | 'H2';
    refresh_token: string;
    createAt : number;
    creatorId: string;    
    
}



interface IEmployee extends Document {

    _id: string;
    status: 'A' | 'B' | 'P';
    division_key: string [];
    user_id : string;
    username : string;
    password: string;
    email : string;
    phone : number;
    role: 'E' | 'H1' | 'H2';
    refresh_token: string;
    createAt : number;
    creatorId: string;    
    // nik: number;
    // booking_status: string;
    // checkIn: Date;
    // checkOut: Date;
}



const EmployeeSchema : Schema = new Schema(
    {

        division_key: [
            {  
                    type: mongoose.Schema.Types.ObjectId,  
                    ref:'Division', 
                    trim: true 
            }
            
        ],

        user_id: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ['A', 'B','P'], // A : Active, B : Block, P : Pending
            required: [true, "status employee cannot be empty"],
            trim: true
        },

        username: {
            type: String,
            // required: [true, "name cannot be empty"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "email cannot be empty"],
            trim: true
        },

        phone: {
            type: Number,
            required: [true, "phome cannot be empty"],
            trim: true
        },

        password: {
            type: String,
            // required: [true, "password cannot be empty"],
            trim: true
        },

        role: {
            type: String,
            enum: ['E','H1','H2'], // E : employee, H1 : Kepala B 1, H2 ; Kepala B 2
            // required: [true, "password cannot be empty"],
            trim: true
        },


        refresh_token: {
            type: String,
            required: false
        },

        isDeleted: {
            type: Boolean,
            default: false  
        },

        // nik: {
        //     type: Number,
        //     required: [true, "userid cannot be empty"],
        //     trim: true
        // },

        // bill_status: {
        //     type: String,
        //     enum: ['lunas', 'belum_lunas','pembayaran'],
        //     required: [true, "bill status cannot be empty"],
        //     trim: true
        // },
        
        // checkIn: {
        //     type: Date,
        //     // required: [true, "password cannot be empty"],
        //     trim: true
        // },

        // checkOut: {
        //     type: Date,
        //     // required: [true, "password cannot be empty"],
        //     trim: true
        // },


    },

    {
        timestamps: true,
    }

);

const  EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema,'Employee');

export default EmployeeModel;

