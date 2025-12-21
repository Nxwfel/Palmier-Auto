import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Parse color values that may come as an array, a JSON string, or a bracketed string like ["blanc"]
export function parseColors(val) {
  if (!val) return ["N/A"];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (typeof parsed === "string") val = parsed;
    } catch {}
    const cleaned = val.replace(/^\[|\]$/g, "").replace(/['"]/g, "");
    return cleaned.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [String(val)];
}
