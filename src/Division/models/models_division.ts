import mongoose, { Document, Schema } from 'mongoose';

interface Employee {
    _id: string
}

export interface Division {
    name : string;
    code : string;
    desc: string;
    status: boolean;
    refresh_token: string;
    createAt : number;
    creatorId: string;
    employee_key: Employee [];    
    item_key: Employee [];    
}


interface IDivision extends Document {
    _id: string;
    name : string;
    code : string;
    desc: string;
    qry:number;
    status: boolean;
    refresh_token: string;
    createAt : number;
    creatorId: string;
    employee_key: Employee [];    
    item_key: Employee [];    
}



const DivisionSchema: Schema = new Schema(

    {

        name: {
            type: String,
            // required: [true, "name cannot be empty"],
            trim: true
        },

        status: {
            type: Boolean,
            // required: [true, "name cannot be empty"],
            default: true,
            trim: true
        },

        desc: {
            type: String,
            // required: [true, "name cannot be empty"],
            trim: true
        },

        code: {
            type: String,
            emum: ['D01','D02','D03','D04'],
            // required: [true, "name cannot be empty"],
            trim: true
        },
        
        qty: {
            type: Number,
            default: 1
        },

        employee_key: [
            {type: mongoose.Schema.Types.ObjectId,trim: true, ref:'Employee'}
        ],

        item_key: [
           {type: mongoose.Schema.Types.ObjectId,trim: true, ref:'Items'}
        ],

        refresh_token: {
            type: String,
            required: false
        },

        isDeleted: {
            type: Boolean,
            default: false  
        },


    },

    {
        timestamps: true,
    }

);

const  DivisionModel = mongoose.model<IDivision>('Division', DivisionSchema,'Division');

export default DivisionModel;

