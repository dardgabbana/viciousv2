"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  if (!(await verifyPassword(password))) {
    return { error: "Invalid password" };
  }

  const token = await createSession();
  const cookieStore = await cookies();
  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto");
  const isHttps = proto === "https";

  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
