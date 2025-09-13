
import { v4 as uuidv4 } from 'uuid'; 
import LeadModel from '../models/lead_models';
import CustomerModel from '../Employee/models/employee_models';
// import CustomerModel from '../models/customer';

export class CustomerControllers {

        static async  CreateCustomer  (req : any , res:any)  {

            const { username , password, email, phone  } = req.body;

            try {

                if( !username || !password || !email ||!phone){
                    return  res.status(400).json({
                        requestId: uuidv4(), 
                        message: `All Field can't be empty`,
                    })
                };
                

                const customer = await CustomerModel.create({
                    username: username,
                    password : password,
                    email: email,
                    phone: phone,
                });

                res.status(201).json(
                    {
                        requestId: uuidv4(), 
                        data: customer,
                        message: "Successfully create customer.",
                        success: true
                    }
                );

            } catch (error) {
                res.status(400).json(
                    {
                        requestId: uuidv4(), 
                        data: null,
                        message:  (error as Error).message,
                        success: false
                    }
                );
            }
        
        }

        static async  getCustomer (req : any, res:any) {

            try {
                const customer = await CustomerModel.find({isDeleted: false }).populate('room_key').lean();;;
                res.status(200).json({
                    requestId: uuidv4(),
                    data: customer,
                    success: true
                })
            } catch (error) {
                console.log(error);
            }
        }

        static async  GetLead  (req : any , res:any)  {

            try {

                const users = await LeadModel.find({isDeleted:false});
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
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


}