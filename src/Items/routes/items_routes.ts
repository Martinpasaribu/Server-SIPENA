import express, { Request, Response, NextFunction } from "express";
import { ItemsControllers } from "../controllers/items_controllers";
import { upload, uploadImage } from "../../config/ImageKit";

const ItemsRouter: express.Router = express.Router();


// semantic meaning
// Auth

ItemsRouter.get("/", ItemsControllers.GetItems)
ItemsRouter.get("/:_id", ItemsControllers.GetItemsFacility)
ItemsRouter.post("/:facility_key", ItemsControllers.PostItems)
ItemsRouter.put("/status/:_id", ItemsControllers.UpdateItemsStatus);
ItemsRouter.patch("/:_id", ItemsControllers.UpdateItems);
ItemsRouter.delete("/:_id", ItemsControllers.DeletedItems);


ItemsRouter.post(
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
  ItemsControllers.AddImage // pakai controller AddImage
);

ItemsRouter.post(
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
  ItemsControllers.AddImageIRepair // pakai controller AddImage
);

// ✅ Add one image ke array `images`
ItemsRouter.post(
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
  ItemsControllers.AddImages // pakai controller AddImages
);

// ✅ Delete image dari array `images`
ItemsRouter.delete(
  "/:code/del/images",
  ItemsControllers.DeletedImages
);
// RoomRouter.delete("/logout", AuthController.Logout);
// RoomRouter.get("/me", AuthController.Me)


export default ItemsRouter;
