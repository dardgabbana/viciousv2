import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { db } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getIpHash(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const salt = process.env.SESSION_SECRET || "vicious-waitlist";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const emailRaw = String(body?.email || "").trim().toLowerCase();
    const website = String(body?.website || "").trim(); // honeypot

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!EMAIL_REGEX.test(emailRaw) || emailRaw.length > 254) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const ipHash = getIpHash(request);
    const userAgent = request.headers.get("user-agent") || null;

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [lastMinuteCount, lastDayCount] = await Promise.all([
      db.waitlistSubscriber.count({ where: { ipHash, createdAt: { gte: oneMinuteAgo } } }),
      db.waitlistSubscriber.count({ where: { ipHash, createdAt: { gte: oneDayAgo } } }),
    ]);

    if (lastMinuteCount >= 3 || lastDayCount >= 30) {
      return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
    }

    const existing = await db.waitlistSubscriber.findUnique({ where: { email: emailRaw } });
    if (existing) {
      return NextResponse.json({ ok: true });
    }

    await db.waitlistSubscriber.create({
      data: {
        email: emailRaw,
        ipHash,
        userAgent: userAgent?.slice(0, 300) || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }
}
