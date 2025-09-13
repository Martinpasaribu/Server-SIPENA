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
const items_controllers_1 = require("../controllers/items_controllers");
const ImageKit_1 = require("../../config/ImageKit");
const ItemsRouter = express_1.default.Router();
// semantic meaning
// Auth
ItemsRouter.get("/", items_controllers_1.ItemsControllers.GetItems);
ItemsRouter.get("/:_id", items_controllers_1.ItemsControllers.GetItemsFacility);
ItemsRouter.post("/:facility_key", items_controllers_1.ItemsControllers.PostItems);
ItemsRouter.put("/status/:_id", items_controllers_1.ItemsControllers.UpdateItemsStatus);
ItemsRouter.patch("/:_id", items_controllers_1.ItemsControllers.UpdateItems);
ItemsRouter.delete("/:_id", items_controllers_1.ItemsControllers.DeletedItems);
ItemsRouter.post("/:code/image", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}), items_controllers_1.ItemsControllers.AddImage // pakai controller AddImage
);
ItemsRouter.post("/:code/image_irepair", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}), items_controllers_1.ItemsControllers.AddImageIRepair // pakai controller AddImage
);
// ✅ Add one image ke array `images`
ItemsRouter.post("/:code/images", ImageKit_1.upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}), items_controllers_1.ItemsControllers.AddImages // pakai controller AddImages
);
// ✅ Delete image dari array `images`
ItemsRouter.delete("/:code/del/images", items_controllers_1.ItemsControllers.DeletedImages);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me)
exports.default = ItemsRouter;
