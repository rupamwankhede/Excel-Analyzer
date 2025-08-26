import React from "react";

interface Props {
  data: any[]; // array of objects
}

function median(arr: number[]) {
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  if (s.length === 0) return 0;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const AIInsights: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;
  // find numeric columns
  const sample = data[0];
  const cols = Object.keys(sample);
  const numericCols = cols.filter((c) =>
    data.every(
      (r) =>
        r[c] === null ||
        r[c] === undefined ||
        r[c] === "" ||
        typeof r[c] === "number"
    )
  );
  if (numericCols.length === 0) return null;

  const insights: string[] = [];

  numericCols.forEach((col) => {
    const vals = data.map((r) => r[col]).filter((v) => typeof v === "number");
    if (vals.length === 0) return;
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    const med = median(vals);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const std = Math.sqrt(
      vals.reduce((a, b) => a + (b - avg) ** 2, 0) / vals.length
    );
    insights.push(
      `${col}: mean ${avg.toFixed(2)}, median ${med.toFixed(
        2
      )}, range ${min}–${max}, std ${std.toFixed(2)}.`
    );
    // detect skew
    if (Math.abs(avg - med) / (Math.abs(med) || 1) > 0.25) {
      insights.push(
        `  - Suggestion: ${col} appears skewed (mean differs from median). Consider log transform or review outliers.`
      );
    }
    // outlier detection simple
    const q1 = vals.sort((a, b) => a - b)[Math.floor(vals.length * 0.25)];
    const q3 = vals.sort((a, b) => a - b)[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1 || 0;
    const outliers = vals
      .filter((v) => iqr && (v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr))
      .slice(0, 5);
    if (outliers.length)
      insights.push(
        `  - Found ${
          outliers.length
        } potential outliers in ${col} (examples: ${outliers
          .slice(0, 3)
          .join(", ")}).`
      );
  });

  return (
    <div className="p-6 mt-6 bg-white shadow rounded-xl">
      <h3 className="mb-3 text-lg font-semibold">AI Insights (auto)</h3>
      <div className="space-y-2">
        {insights.map((ins, i) => (
          <div key={i} className="text-sm text-gray-700">
            {ins}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
