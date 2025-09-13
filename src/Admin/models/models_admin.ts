import mongoose, { Document, Schema } from 'mongoose';



interface IAdmin extends Document {
    user_id: string,
    username : string;
    password: string;
    email : string;
    role : string;
    status: string;
    active: boolean;
    refresh_token: string;
    createAt : number;
    creatorId: string;    
}



const AdminSchema: Schema = new Schema(
    {

        user_id: {
            type: String,
            required: [true, "name cannot be empty"],
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
        
        role: {
            type: String,
            enum: ["A","CA", "SA"], // Sesuaikan dengan role yang diperlukan
            required: true,
            trim: true,
        }, 
               
        status: {
            type: String,
            enum: ["B", "V","P"], // Sesuaikan dengan role yang diperlukan
            required: false,
            default: 'V',
            trim: true,
        },  

        active: {
            type: Boolean,
            required: false,
            default: true,
            trim: true,
        },      

        password: {
            type: String,
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


    },

    {
        timestamps: true,
    }

);

const  AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema,'Admin');

export default AdminModel;

