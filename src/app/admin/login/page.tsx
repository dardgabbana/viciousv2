"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import Image from "next/image";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-6">
        <Image src="/images/logo-white.png" alt="Vicious" width={180} height={68} className="w-[140px] md:w-[180px] h-auto" priority />
      </div>

      <div className="admin-card w-full max-w-md p-6">
        <h1 className="admin-heading text-center mb-6" style={{ fontSize: "20px" }}>
          Admin Login
        </h1>

        <form action={formAction}>
          <div className="mb-4">
            <label className="admin-input-label">Password</label>
            <input type="password" name="password" required className="admin-input" placeholder="Enter admin password" />
          </div>

          {state?.error && (
            <div className="mb-4 p-3 rounded-md text-sm text-[#f3c2c2] border border-[#5e2d33] bg-[#32191d]">
              {state.error}
            </div>
          )}

          <button type="submit" disabled={pending} className="admin-btn w-full">
            {pending ? "Logging in..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
