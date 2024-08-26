import dotenv from "dotenv";
import path from "node:path";

process.env.APP_ROOT = path.join(__dirname, "../../..");

const is_development = process.env.NODE_ENV === "development";
if (!is_development) {
  dotenv.config({ path: path.join(process.env.APP_ROOT, ".env.production") });
}

export const isDevelopment = process.env.NODE_ENV === "development";

export const isProduction = process.env.NODE_ENV === "production";
