import mongoose from 'mongoose';
import { Division } from '../../Division/models/models_division';
import { Employee } from '../../Employee/models/employee_models';

interface IRepair {
    price : number,
    note: string,
    createdAt: Date
}
interface IDivision_keys {
    _id : string,
    name: string,
    code: string
}

interface IReport extends Document{
    report_code:  string,
    employee_key: Employee[],
    division_key: IDivision_keys,
    facility_key: string,
    report_type:  "BK" | "M" | "BL" | "K";
    broken_type:  "R" | "S" | "B";
    progress:     "A" | "P" | "S" | "T" | "RU";
    complain_des: string,
    progress_end: Date,
    broken_des:   string,
    repair:       IRepair,
    admin_note:   string,
    status:       boolean,
    image:        string,
    createdAt:    Date
}

const ReportSchema = new mongoose.Schema({

    report_code: { type: String, required: true, unique: true },
    
    employee_key: {             
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        // default: '', 
        required: false 
    },
    
    division_key: {

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Division',
            required: false,
      
    },

    facility_key: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: false, 
    },

    repair: {

        price : { type : Number, default: ''},
        note : { type : String, default: '' },
        createdAt : { type: String, default: Date.now() }

    },

    report_type: { type: String, required: false, enum: [ "BK" , "M" , "BL", "K"], },
    broken_type: { type: String, required: false, enum: [ "R" , "S" , "B", ""], },
    progress: { type: String, required: false, enum: [ "A" , "P" , "S", "T", "RU"], default:'A' },
    progress_end: { type: Date, required: false},
    complain_des: { type: String, required: false },
    broken_des: { type: String, required: false },
    admin_note: { type: String, required: false, default: '' },
    status: { type: Boolean, default: false},
    image: { type: String, default: '',  required: false },
    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  ReportModel = mongoose.model<IReport>('Report', ReportSchema,'Report');

export default ReportModel;
