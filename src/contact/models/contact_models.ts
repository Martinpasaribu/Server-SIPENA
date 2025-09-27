import mongoose, { Document } from "mongoose";
import { ref } from "process";



export interface IContact extends Document {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  status: "UR" | "R" ; // UR ; Un Read, R : Read,
  isDeleted: boolean;
  code: string;

}

const ContactSchema = new mongoose.Schema(
  {

    name : { type: String, required: false },
    email : { type: String, required: false },
    message : { type: String, required: false },
    phone : { type: Number, required: false },
    code : { type: String, required: false },
  
    status: {
      type: String,
      required: false,
      enum: ["UR", "R"],
      default: "UR"
    },
    
    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const ContactModel = mongoose.model<IContact>(
  "Contact",
  ContactSchema,
  "Contact"
);

export default ContactModel;
