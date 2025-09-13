import express, { Request, Response, NextFunction } from "express";
import { FacilityControllers } from "../controllers/facility_controllers";
import { upload, uploadImage } from "../../config/ImageKit";

const FacilityRouter: express.Router = express.Router();


// semantic meaning


// Auth

FacilityRouter.get("/", FacilityControllers.GetFacility)
FacilityRouter.post("/", FacilityControllers.PostFacility)
FacilityRouter.get("/code", FacilityControllers.GetCodeFacility);
FacilityRouter.get("/:category_id", FacilityControllers.GetCodeFacilityById);
FacilityRouter.put("/status/:_id", FacilityControllers.UpdateFacilityStatus);
FacilityRouter.patch("/:_id", FacilityControllers.UpdateFacility);
FacilityRouter.delete("/:_id", FacilityControllers.DeletedFacility);


FacilityRouter.post(
  "/:code/image",
  upload,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const uploadedImageUrl = await uploadImage(req.file);
      req.body.image = uploadedImageUrl; // inject ke body biar controller gampang pakai
      next();
    } catch (err) {
      console.error("❌ Error upload main image:", err);
      return res.status(500).json({ error: "Gagal upload gambar" });
    }
  },
  FacilityControllers.AddImage // pakai controller AddImage
);

FacilityRouter.post(
  "/:code/image_irepair",
  upload,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const uploadedImageUrl = await uploadImage(req.file);
      req.body.image_irepair = uploadedImageUrl; // inject ke body biar controller gampang pakai
      next();
    } catch (err) {
      console.error("❌ Error upload image invoice repair:", err);
      return res.status(500).json({ error: "Gagal upload gambar" });
    }
  },
  FacilityControllers.AddImageIRepair // pakai controller AddImage
);

// ✅ Add one image ke array `images`
FacilityRouter.post(
  "/:code/images",
  upload,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const uploadedImageUrl = await uploadImage(req.file);
      req.body.images = uploadedImageUrl; // biar konsisten sama controller
      next();
    } catch (err) {
      console.error("❌ Error upload images:", err);
      return res.status(500).json({ error: "Gagal upload gambar" });
    }
  },
  FacilityControllers.AddImages // pakai controller AddImages
);

// ✅ Delete image dari array `images`
FacilityRouter.delete(
  "/:code/del/images",
  FacilityControllers.DeletedImages
);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me)


export default FacilityRouter;
