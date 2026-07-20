import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-secret-key-change-in-production"
);

export async function createSession(): Promise<string> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const session = await db.adminSession.create({
    data: { expiresAt },
  });

  const token = await new SignJWT({ sessionId: session.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secretKey);

  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    const session = await db.adminSession.findUnique({
      where: { id: payload.sessionId as string },
    });

    if (!session || session.expiresAt < new Date()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  return verifySession(token);
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === process.env.ADMIN_PASSWORD;
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await db.adminSession.delete({ where: { id: sessionId } });
  } catch {
    // Session may already be deleted
  }
}
