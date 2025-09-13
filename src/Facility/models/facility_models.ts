import mongoose, { Document } from "mongoose";


interface Data1 {
  date: Date,
  qty: Number;
  price: Number;
}

interface Data2 {
  date: Date,
  qty: Number;
  price: Number;
}

interface Item {
  _id: string
}


export interface IFacility extends Document {
  code: string;
  name: string;
  qty: number;
  desc: string;
  items_key: Item[];
  status: "A" | "R" | "B" ; // A ; available, R : Repair, T : tidak digunakan
  unit: "D" | "U" | "B" ; // D : dummy, U ; unit, B : buah
  data_before : Data1; 
  data_after : Data2; 
  category: "BK" | "M" | "BL" ;
  isDeleted: boolean;
}

const FacilitySchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: false },
    desc: { type: String, unique: false, required: false },
    qty: { type: Number, required: true, default: 0 },

    unit: {
      type: String,
      required: false,
      enum: ["D", "U", "B"],
    },
    
    status: {
      type: String,
      required: false,
      enum: ["A", "R", "B"],
    },
    
    data_before: {
      qty : { type: Number, required: false},
      price : { type: Number, required: false},
      date : { type: Date, required: false}
    },

    items_key: {
      _id : { type: mongoose.Schema.Types.ObjectId, ref:"Items", required: false},
    },

    data_after: {
      qty : { type: Number, required: false},
      price : { type: Number, required: false},
      date : { type: Date, required: false}
    },

    category: {
      type: String,
      required: false,
      enum: ["BK", "M", "BL"],
    },

    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const FacilityModel = mongoose.model<IFacility>(
  "Facility",
  FacilitySchema,
  "Facility"
);

export default FacilityModel;
