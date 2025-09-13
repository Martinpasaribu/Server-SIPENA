"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controllers_1 = require("../controllers/booking_controllers");
const BookingRouter = express_1.default.Router();
// semantic meaning
BookingRouter.post("/", booking_controllers_1.BookingControllers.PostBooking);
BookingRouter.get("/", booking_controllers_1.BookingControllers.GetBooking);
BookingRouter.patch("/:id/:room_key", booking_controllers_1.BookingControllers.UpdateBookingStatus);
exports.default = BookingRouter;
