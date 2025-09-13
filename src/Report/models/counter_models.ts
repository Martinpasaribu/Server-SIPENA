// src/models/Counter.ts
import mongoose, { Schema, Document } from "mongoose";

export interface CounterDoc extends Document {
  report_type: string;   // BK, M, BL, K
  date: string;          // 20250901
  seq: number;
}

const CounterSchema = new Schema<CounterDoc>({
  report_type: { type: String, required: true },
  date: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// kombinasi type + date harus unik
CounterSchema.index({ report_type: 1, date: 1 }, { unique: true });

export default mongoose.models.Counter ||
  mongoose.model<CounterDoc>("Counter", CounterSchema);
