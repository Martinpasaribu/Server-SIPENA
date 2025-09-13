"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controllers_1 = require("../controllers/report_controllers");
const ImageKit_1 = require("../../config/ImageKit");
const VerifyAdminId_1 = require("../../middleware/VerifyAdminId");
const ReportRouter = express_1.default.Router();
// semantic meaning
// upload single image
ReportRouter.post("/", ImageKit_1.upload, // ✅ langsung pakai middleware
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔥 Hasil req.file by addRoom:", req.file);
    if (!req.file) {
        return next(); // kalau nggak ada file, lanjut ke controller
    }
    try {
        const uploadedImageUrl = yield (0, ImageKit_1.uploadImage)(req.file);
        if (uploadedImageUrl) {
            // simpan ke body agar bisa dipakai di ReportController
            req.body.image = uploadedImageUrl;
        }
        next();
    }
    catch (error) {
        console.error("❌ Error uploading image:", error);
        return res.status(500).json({ error: "Gagal mengunggah gambar." });
    }
}), report_controllers_1.ReportControllers.PostReport);
ReportRouter.get("/", VerifyAdminId_1.verifyAdmin, report_controllers_1.ReportControllers.GetReportAll);
ReportRouter.get("/:customer_id", report_controllers_1.ReportControllers.GetReportCustomer);
ReportRouter.put("/:id", report_controllers_1.ReportControllers.UpdateReport);
ReportRouter.delete("/:id", report_controllers_1.ReportControllers.DeleteReport);
exports.default = ReportRouter;
