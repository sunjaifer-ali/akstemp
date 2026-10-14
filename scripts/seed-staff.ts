import { config } from "dotenv";
config({ path: ".env.local" });
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { users } from "../db/schema";

const DEFAULT_PASSWORD = "Akshaya@1";
const people = [
  { displayName: "Jaifer Ali", username: "jaifer", role: "ADMIN" as const },
  { displayName: "Aneesa", username: "aneesa", role: "STAFF" as const },
  { displayName: "Ajitha", username: "ajitha", role: "STAFF" as const },
  { displayName: "Sheena", username: "sheena", role: "STAFF" as const },
  { displayName: "Rubeena", username: "rubeena", role: "STAFF" as const },
  { displayName: "Haseena", username: "haseena", role: "STAFF" as const },
];

async function main() {
  const db = getDb();
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  for (const person of people) {
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, person.username)).limit(1);
    if (existing) {
      console.log(`Skipped existing user: ${person.username}`);
      continue;
    }
    await db.insert(users).values({ ...person, passwordHash: hash, active: true });
    console.log(`Created ${person.displayName} (${person.role}), username: ${person.username}`);
  }
  console.log("Done. All newly created users have the temporary password Akshaya@1. Each user should change it after signing in.");
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "User setup failed"); process.exit(1); });
