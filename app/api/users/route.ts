import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { users, auditLog } from "@/db/schema";

async function authorized() {
  const session = await getSession();
  return session && (session.role === "ADMIN" || session.role === "OWNER") ? session : null;
}
export async function GET() {
  const actor = await authorized();
  if (!actor) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  try {
    const rows = await getDb().select({ id: users.id, displayName: users.displayName, username: users.username, role: users.role, active: users.active, createdAt: users.createdAt }).from(users).orderBy(asc(users.displayName));
    return NextResponse.json({ users: rows });
  } catch { return NextResponse.json({ error: "Could not load users." }, { status: 500 }); }
}
export async function POST(req: Request) {
  const actor = await authorized();
  if (!actor) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  try {
    const body = await req.json();
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const role = body.role === "ADMIN" ? "ADMIN" : "STAFF";
    if (!displayName || displayName.length > 120 || !/^[a-z0-9._-]{3,80}$/.test(username)) return NextResponse.json({ error: "Enter a name and a username (3–80 letters, numbers, dots, underscores or hyphens)." }, { status: 400 });
    const db = getDb();
    if ((await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1)).length) return NextResponse.json({ error: "That username already exists." }, { status: 409 });
    const [created] = await db.insert(users).values({ displayName, username, role, passwordHash: await bcrypt.hash("Akshaya@1", 12), active: true }).returning({ id: users.id, displayName: users.displayName, username: users.username, role: users.role, active: users.active });
    await db.insert(auditLog).values({ actorId: actor.id, action: "USER_CREATED", entityType: "user", entityId: created.id, summary: `Created user ${username}` });
    return NextResponse.json({ user: created, temporaryPassword: "Akshaya@1" }, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not create user." }, { status: 500 }); }
}
export async function PATCH(req: Request) {
  const actor = await authorized();
  if (!actor) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  try {
    const body = await req.json();
    if (typeof body.id !== "string" || typeof body.active !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    if (body.id === actor.id && !body.active) return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
    const db = getDb();
    const [updated] = await db.update(users).set({ active: body.active, updatedAt: new Date() }).where(eq(users.id, body.id)).returning({ id: users.id, username: users.username, active: users.active });
    if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });
    await db.insert(auditLog).values({ actorId: actor.id, action: body.active ? "USER_ACTIVATED" : "USER_DEACTIVATED", entityType: "user", entityId: updated.id, summary: `${body.active ? "Activated" : "Deactivated"} user ${updated.username}` });
    return NextResponse.json({ user: updated });
  } catch { return NextResponse.json({ error: "Could not update user." }, { status: 500 }); }
}
