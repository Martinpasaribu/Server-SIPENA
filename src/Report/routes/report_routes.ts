import express, { Request, Response, NextFunction } from "express";
import { ReportControllers } from "../controllers/report_controllers";
import { upload, uploadImage } from "../../config/ImageKit";
import { verifyAdmin } from "../../middleware/VerifyAdminId";

const ReportRouter: express.Router = express.Router();


// semantic meaning


// upload single image
ReportRouter.post(
  "/",
  upload, // ✅ langsung pakai middleware
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("🔥 Hasil req.file by addRoom:", req.file);

    if (!req.file) {
      return next(); // kalau nggak ada file, lanjut ke controller
    }

    try {
      const uploadedImageUrl = await uploadImage(req.file);

      if (uploadedImageUrl) {
        // simpan ke body agar bisa dipakai di ReportController
        req.body.image = uploadedImageUrl;
      }

      next();
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return res.status(500).json({ error: "Gagal mengunggah gambar." });
    }
  },
  ReportControllers.PostReport
);

ReportRouter.get("/", verifyAdmin, ReportControllers.GetReportAll);
ReportRouter.get("/:customer_id", ReportControllers.GetReportCustomer);
ReportRouter.put("/:id", ReportControllers.UpdateReport);
ReportRouter.delete("/:id", ReportControllers.DeleteReport);


export default ReportRouter;
