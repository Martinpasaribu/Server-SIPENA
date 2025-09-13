// src/utils/reportCode.ts

import counter_models from "../Report/models/counter_models";

export async function generateReportCode(reportType: string): Promise<string> {
  const prefix = reportType; // BK, M, BL, K
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20250901

  // Increment counter secara atomic
  const counter = await counter_models.findOneAndUpdate(
    { report_type: reportType, date: datePart },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const counterPart = counter.seq.toString().padStart(4, "0"); // 0001
  return `${prefix}-${datePart}-${counterPart}`;
}
