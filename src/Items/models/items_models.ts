import mongoose, { Document } from "mongoose";
import { ref } from "process";



export interface Items extends Document {
  _id: string;
  facility_key: string;
  name: string;
  nup: string;
  qty: number;
  desc: string;
  division_key: string;
  status: "A" | "R" | "B" ; // A ; available, R : Repair, T : tidak digunakan
  isDeleted: boolean;

}

const ItemsSchema = new mongoose.Schema(
  {
    facility_key: { 
      type: mongoose.Schema.Types.ObjectId,
      ref:"Facility",
      required: true 
    },

    name : { type: String, unique: false, required: false },
    nup  : { type: String, unique: true, required: false },
    qty  : { type: Number, required: true, default: 1 },
    desc : { type: String, unique: true, required: false },

    division_key : { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'Division', required: false ,  default: null },
    
    status: {
      type: String,
      required: false,
      enum: ["A", "R", "B"],
    },
    
    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const ItemModel = mongoose.model<Items>(
  "Items",
  ItemsSchema,
  "Items"
);

export default ItemModel;
