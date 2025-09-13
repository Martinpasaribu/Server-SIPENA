import express, { Request, Response, NextFunction } from "express";
import { BookingControllers } from "../controllers/booking_controllers";

const BookingRouter: express.Router = express.Router();


// semantic meaning

BookingRouter.post("/", BookingControllers.PostBooking);
BookingRouter.get("/", BookingControllers.GetBooking);
BookingRouter.patch("/:id/:room_key", BookingControllers.UpdateBookingStatus);



export default BookingRouter;
