import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { users, auditLog } from "@/db/schema";
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  try {
    const body = await req.json();
    const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const next = typeof body.newPassword === "string" ? body.newPassword : "";
    if (next.length < 10 || next.length > 200) return NextResponse.json({ error: "New password must be at least 10 characters." }, { status: 400 });
    const db = getDb();
    const [u] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
    if (!u || !u.active || !(await bcrypt.compare(current, u.passwordHash))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    await db.update(users).set({ passwordHash: await bcrypt.hash(next, 12), updatedAt: new Date() }).where(eq(users.id, u.id));
    await db.insert(auditLog).values({ actorId: u.id, action: "PASSWORD_CHANGED", entityType: "user", entityId: u.id, summary: "User changed their password" });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Could not change password." }, { status: 500 }); }
}
