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
const room_controllers_1 = require("../controllers/room_controllers");
const ImageKit_1 = require("../../config/ImageKit");
const RoomRouter = express_1.default.Router();
// semantic meaning
// Auth
RoomRouter.post("/", room_controllers_1.RoomControllers.PostRoom);
RoomRouter.get("/", room_controllers_1.RoomControllers.GetRoom);
RoomRouter.delete("/:id", room_controllers_1.RoomControllers.DeleteRoom);
RoomRouter.get("/:roomId/facility", room_controllers_1.RoomControllers.GetFacilities);
RoomRouter.patch("/:roomId/facility/:facilityCode", room_controllers_1.RoomControllers.UpdateFacilityStatus);
RoomRouter.post("/:roomId/facility", room_controllers_1.RoomControllers.AddFacility);
RoomRouter.get("/code-room", room_controllers_1.RoomControllers.GetCodeRoom);
// ✅ Add one image ke array `images`
RoomRouter.post("/:code/images", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}), room_controllers_1.RoomControllers.AddImages // pakai controller AddImages
);
RoomRouter.post("/:code/facility/:facilityId/image", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    try {
        const uploadedImageUrl = yield (0, ImageKit_1.uploadImage)(req.file);
        req.body.image = uploadedImageUrl; // biar konsisten sama controller
        next();
    }
    catch (err) {
        console.error("❌ Error upload images:", err);
        return res.status(500).json({ error: "Gagal upload gambar" });
    }
}), room_controllers_1.RoomControllers.UploadFacilityImage // pakai controller AddImages
);
RoomRouter.delete("/:code/facility/:facilityId/image", room_controllers_1.RoomControllers.DeleteFacilityImage);
// ✅ Delete image dari array `images`
RoomRouter.delete("/:code/del/images", room_controllers_1.RoomControllers.DeletedImages);
exports.default = RoomRouter;
