"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controllers_1 = require("../controllers/contact_controllers");
const ItemsRouter = express_1.default.Router();
// semantic meaning
// Auth
ItemsRouter.post("/", contact_controllers_1.ContactControllers.PostContact);
ItemsRouter.get("/", contact_controllers_1.ContactControllers.GetAllContacts);
ItemsRouter.patch("/:id/read", contact_controllers_1.ContactControllers.ContactRead);
exports.default = ItemsRouter;
