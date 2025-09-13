
import { v4 as uuidv4 } from 'uuid'; 
import { Request, Response } from "express";
import ReportModel from '../models/report_models';
import { CalculateDuration } from '../../utils/Format/Date';
import { generateReportCode } from '../../utils/Generate_code';
import { sendTelegramMessage } from '../../utils/Telegram';
import { TypeBroken, TypeReport } from '../constant';
import EmployeeModel from '../../Employee/models/employee_models';

export class ReportControllers {


        static async PostReport(req: any, res: any) {

            const { employee_key, division_key, report_type, facility_key, broken_type, complain_des, broken_des, image } = req.body;

            try {
                // 1. Validasi input
                if (!report_type) {
                    return res.status(400).json({
                        requestId: uuidv4(),
                        message: `All fields report can't be empty`,
                        success: false,
                    });
                }

                const code = await generateReportCode(report_type);
                
                // 1. Cari employee
                const employee = await EmployeeModel.findById(employee_key).select('username')   
                // .populate("employee_key")        
                // .populate({
                //     path: "division_key._id", // populate ke dalam subdocument
                //     model: "Division"
                // });


                // 2. Create report
                const newReport = await ReportModel.create({
                    report_code: code,
                    broken_des,
                    complain_des,
                    broken_type,
                    facility_key,
                    division_key,
                    report_type,
                    employee_key,
                    image: image || "",   // langsung ambil dari req.body.image
                    status: true,
                });

                const Detail_Report = {
                    id: newReport.report_code,
                    name: employee?.username || "-",  
                    divisi: employee?.division_key || "-",  
                    tipe_Kerusakan: TypeBroken(broken_type), // translate pakai helper
                    tipe_Report: TypeReport(report_type),    // translate pakai helper
                    desc: complain_des? complain_des : broken_des,
                    createdAt: newReport.createdAt,
                };

                await sendTelegramMessage("System Notification SIPENA", Detail_Report);

                // 3. Response sukses
                return res.status(201).json({
                    requestId: uuidv4(),
                    data: newReport,
                    message: "Successfully created report.",
                    success: true,
                });
            } catch (error) {
                return res.status(500).json({
                    requestId: uuidv4(),
                    data: null,
                    message: (error as Error).message,
                    success: false,
                });
            }
        }


        static async GetReportCustomer (req : any , res:any)  {

            const {customer_id} = req.params

            try {

                const users = await ReportModel.find({ employee_key: customer_id,  isDeleted:false}).populate("employee_key").sort({ createdAt: -1 });;
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true,
                    message: 'success get data report customer'
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


        static async GetReportAll(req: any, res: any) {
        try {
            const reports = await ReportModel.find({ isDeleted: false })
            .populate({ path: "employee_key" })
            .sort({ createdAt: -1 });

            if (!reports || reports.length === 0) {
            return res.status(400).json({
                requestId: uuidv4(),
                message: `All data empty`,
                success: false,
            });
            }

            // mapping data biar setiap report punya duration
            const dataWithDuration = reports.map((report) => {
            const duration = CalculateDuration(report.createdAt, report.progress_end);
            return {
                ...report.toObject(),
                duration,
            };
            });

            return res.status(200).json({
            requestId: uuidv4(),
            data: dataWithDuration,
            success: true,
            message: "success get all data report customer",
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message || "Internal Server Error",
            success: false,
            });
        }
        }

        // ✅ Get Report by ID
        static async GetReportById(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const report = await ReportModel.findById(id);

            if (!report) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: report,
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
            });
            }
        }

        // ✅ Update Report
        static async UpdateReport(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { progress } = req.body;

            // logika progress_end
            let progress_end: Date | null = null;
            if (progress === "S" || progress === "T") {
            progress_end = new Date();
            }

            const updated = await ReportModel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                progress_end, // update progress_end sesuai logika
            },
            { new: true }
            );

            if (!updated) {
            return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
            });
            }

            return res.status(200).json({
            requestId: uuidv4(),
            data: updated,
            message: "Report updated successfully",
            success: true,
            });
        } catch (error) {
            return res.status(500).json({
            requestId: uuidv4(),
            data: null,
            message: (error as Error).message,
            success: false,
            });
        }
        }


        // ✅ Delete Report
        static async DeleteReport(req: Request, res: Response) {
            try {
            const { id } = req.params;
            const deleted = await ReportModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({
                requestId: uuidv4(),
                message: "Report not found",
                success: false,
                });
            }

            return res.status(200).json({
                requestId: uuidv4(),
                data: deleted,
                message: "Report deleted successfully",
                success: true,
            });
            } catch (error) {
            return res.status(500).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message,
                success: false,
            });
            }
        }


}
