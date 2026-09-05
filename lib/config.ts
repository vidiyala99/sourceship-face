export const DEFAULT_EVENT_URL = "https://luma.com/burningtoken";
export const DEFAULT_GOAL = "shortlist who to thank / partner with";

/** Demo mode is ON unless explicitly set to "false". */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
