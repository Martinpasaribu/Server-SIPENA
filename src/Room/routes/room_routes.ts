import express, { Request, Response, NextFunction } from "express";
import { RoomControllers } from "../controllers/room_controllers";
import { upload, uploadImage } from "../../config/ImageKit";

const RoomRouter: express.Router = express.Router();


// semantic meaning


// Auth

RoomRouter.post("/", RoomControllers.PostRoom);
RoomRouter.get("/", RoomControllers.GetRoom);
RoomRouter.delete("/:id", RoomControllers.DeleteRoom);
RoomRouter.get("/:roomId/facility", RoomControllers.GetFacilities);
RoomRouter.patch("/:roomId/facility/:facilityCode", RoomControllers.UpdateFacilityStatus);
RoomRouter.post("/:roomId/facility", RoomControllers.AddFacility);
RoomRouter.get("/code-room", RoomControllers.GetCodeRoom);


// ✅ Add one image ke array `images`
RoomRouter.post(
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
  RoomControllers.AddImages // pakai controller AddImages
);

RoomRouter.post(
  "/:code/facility/:facilityId/image",
  upload,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const uploadedImageUrl = await uploadImage(req.file);
      req.body.image = uploadedImageUrl; // biar konsisten sama controller
      next();
    } catch (err) {
      console.error("❌ Error upload images:", err);
      return res.status(500).json({ error: "Gagal upload gambar" });
    }
  },
  RoomControllers.UploadFacilityImage // pakai controller AddImages
);




RoomRouter.delete(
  "/:code/facility/:facilityId/image",
  RoomControllers.DeleteFacilityImage
);

// ✅ Delete image dari array `images`
RoomRouter.delete(
  "/:code/del/images",
  RoomControllers.DeletedImages
);

export default RoomRouter;
