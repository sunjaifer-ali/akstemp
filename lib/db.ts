import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

export function getDb() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Configure it locally in .env.local.");
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}
