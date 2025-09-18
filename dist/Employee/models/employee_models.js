"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EmployeeSchema = new mongoose_1.Schema({
    division_key: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Division',
            trim: true
        }
    ],
    user_id: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['A', 'B', 'P'], // A : Active, B : Block, P : Pending
        required: [true, "status employee cannot be empty"],
        trim: true
    },
    username: {
        type: String,
        // required: [true, "name cannot be empty"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email cannot be empty"],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, "phome cannot be empty"],
        trim: true
    },
    password: {
        type: String,
        // required: [true, "password cannot be empty"],
        trim: true
    },
    role: {
        type: String,
        enum: ['E', 'H1', 'H2'], // E : employee, H1 : Kepala B 1, H2 ; Kepala B 2
        // required: [true, "password cannot be empty"],
        trim: true
    },
    refresh_token: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    // nik: {
    //     type: Number,
    //     required: [true, "userid cannot be empty"],
    //     trim: true
    // },
    // bill_status: {
    //     type: String,
    //     enum: ['lunas', 'belum_lunas','pembayaran'],
    //     required: [true, "bill status cannot be empty"],
    //     trim: true
    // },
    // checkIn: {
    //     type: Date,
    //     // required: [true, "password cannot be empty"],
    //     trim: true
    // },
    // checkOut: {
    //     type: Date,
    //     // required: [true, "password cannot be empty"],
    //     trim: true
    // },
}, {
    timestamps: true,
});
const EmployeeModel = mongoose_1.default.model('Employee', EmployeeSchema, 'Employee');
exports.default = EmployeeModel;
