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
exports.RoomServices = void 0;
const room_models_1 = __importDefault(require("../models/room_models"));
class RoomService {
    KeepRoomBooking(status, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newStatus;
                if (status === "confirmed") {
                    newStatus = false; // kamar dipakai
                }
                else if (status === "canceled") {
                    newStatus = true; // kamar dilepas
                }
                else {
                    throw new Error("Status tidak valid");
                }
                const updatedRoom = yield room_models_1.default.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
                if (!updatedRoom) {
                    throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
                }
                return updatedRoom;
            }
            catch (err) {
                console.error("Gagal update status kamar:", err);
                throw err;
            }
        });
    }
    CekRoomAvailable(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RoomStatus = yield room_models_1.default.findOne({ _id, isDeleted: false });
                if (!RoomStatus) {
                    throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
                }
                return RoomStatus.status;
            }
            catch (err) {
                console.error("Gagal cek status kamar:", err);
                throw err;
            }
        });
    }
    UpdateStatusRoom(status, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newStatus;
                if (status === "M" || status === "P") {
                    newStatus = false; // kamar dipakai
                }
                else if (status === "K") {
                    newStatus = true; // kamar dilepas
                }
                else {
                    throw new Error("Status tidak valid");
                }
                const updatedRoom = yield room_models_1.default.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
                if (!updatedRoom) {
                    throw new Error(`Room not found ${_id}`); // lempar error, biar controller yang handle response
                }
                return updatedRoom;
            }
            catch (err) {
                console.error("Gagal update status kamar:", err);
                throw err;
            }
        });
    }
}
exports.RoomServices = new RoomService();
