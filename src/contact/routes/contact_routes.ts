import express, { Request, Response, NextFunction } from "express";
import { upload, uploadImage } from "../../config/ImageKit";
import { ContactControllers } from "../controllers/contact_controllers";

const ItemsRouter: express.Router = express.Router();


// semantic meaning
// Auth

ItemsRouter.post("/", ContactControllers.PostContact)
ItemsRouter.get("/", ContactControllers.GetAllContacts)
ItemsRouter.patch("/:id/read", ContactControllers.ContactRead)



export default ItemsRouter;
