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
const facility_controllers_1 = require("../controllers/facility_controllers");
const ImageKit_1 = require("../../config/ImageKit");
const FacilityRouter = express_1.default.Router();
// semantic meaning
// Auth
FacilityRouter.get("/", facility_controllers_1.FacilityControllers.GetFacility);
FacilityRouter.post("/", facility_controllers_1.FacilityControllers.PostFacility);
FacilityRouter.get("/code", facility_controllers_1.FacilityControllers.GetCodeFacility);
FacilityRouter.get("/:category_id", facility_controllers_1.FacilityControllers.GetCodeFacilityById);
FacilityRouter.put("/status/:_id", facility_controllers_1.FacilityControllers.UpdateFacilityStatus);
FacilityRouter.patch("/:_id", facility_controllers_1.FacilityControllers.UpdateFacility);
FacilityRouter.delete("/:_id", facility_controllers_1.FacilityControllers.DeletedFacility);
FacilityRouter.post("/:code/image", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    try {
        const uploadedImageUrl = yield (0, ImageKit_1.uploadImage)(req.file);
        req.body.image = uploadedImageUrl; // inject ke body biar controller gampang pakai
        next();
    }
    catch (err) {
        console.error("❌ Error upload main image:", err);
        return res.status(500).json({ error: "Gagal upload gambar" });
    }
}), facility_controllers_1.FacilityControllers.AddImage // pakai controller AddImage
);
FacilityRouter.post("/:code/image_irepair", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    try {
        const uploadedImageUrl = yield (0, ImageKit_1.uploadImage)(req.file);
        req.body.image_irepair = uploadedImageUrl; // inject ke body biar controller gampang pakai
        next();
    }
    catch (err) {
        console.error("❌ Error upload image invoice repair:", err);
        return res.status(500).json({ error: "Gagal upload gambar" });
    }
}), facility_controllers_1.FacilityControllers.AddImageIRepair // pakai controller AddImage
);
// ✅ Add one image ke array `images`
FacilityRouter.post("/:code/images", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    try {
        const uploadedImageUrl = yield (0, ImageKit_1.uploadImage)(req.file);
        req.body.images = uploadedImageUrl; // biar konsisten sama controller
        next();
    }
    catch (err) {
        console.error("❌ Error upload images:", err);
        return res.status(500).json({ error: "Gagal upload gambar" });
    }
}), facility_controllers_1.FacilityControllers.AddImages // pakai controller AddImages
);
// ✅ Delete image dari array `images`
FacilityRouter.delete("/:code/del/images", facility_controllers_1.FacilityControllers.DeletedImages);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me)
exports.default = FacilityRouter;
