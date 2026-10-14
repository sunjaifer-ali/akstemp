import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // Allows config inspection without connecting; migrations require DATABASE_URL.
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost/placeholder"
  },
  strict: true,
  verbose: true
});
