import ImageKit from "imagekit";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.publicKey || "",
  privateKey: process.env.privateKey || "",
  urlEndpoint: process.env.urlEndpoint || "",
});

// 🔹 Fungsi upload ke ImageKit
export const uploadImage = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer, // buffer dari multer.memoryStorage()
        fileName: file.originalname,
        folder: "DBTestAdmin",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.url || "");
      }
    );
  });
};

// 🔹 Storage multer (pakai memory untuk langsung ambil buffer)
const storage = multer.memoryStorage();

// 🔹 Upload hanya 1 file dengan field "image"
export const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // maksimal 25MB
}).single("image"); // 👉 hanya untuk 1 file
