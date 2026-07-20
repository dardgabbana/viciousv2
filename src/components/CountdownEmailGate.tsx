"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const TARGET_DATE = "2026-05-15T00:00:00";

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { total: diff, days, hours, minutes, seconds };
}

export default function CountdownEmailGate() {
  const [remaining, setRemaining] = useState(() => getRemaining(TARGET_DATE));
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(TARGET_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const countdownText = useMemo(
    () =>
      `${String(remaining.days).padStart(2, "0")} : ${String(remaining.hours).padStart(2, "0")} : ${String(remaining.minutes).padStart(2, "0")} : ${String(remaining.seconds).padStart(2, "0")}`,
    [remaining.days, remaining.hours, remaining.minutes, remaining.seconds]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Could not subscribe right now.");
        return;
      }
      setStatus("ok");
      setMessage("You're in. We’ll notify you.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe right now.");
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto border border-[var(--v-border)] bg-black/50 p-5 md:p-8">
      <p className="v-subtitle">COUNTDOWN TO DROP · MAY 15, 2026</p>
      <p className="v-title mt-2" style={{ fontSize: "clamp(24px, 5vw, 48px)" }}>
        {countdownText}
      </p>
      <p className="v-ui-11 v-muted mt-2">DAYS : HOURS : MINUTES : SECONDS</p>

      <form onSubmit={onSubmit} className="mt-6">
        <label className="v-input-label">EMAIL UPDATES</label>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="v-input flex-1"
            autoComplete="email"
          />
          <button type="submit" className="v-btn px-4 py-3 md:min-w-[140px]" disabled={status === "loading"}>
            {status === "loading" ? "SENDING..." : "NOTIFY ME"}
          </button>
        </div>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden
        />
        {message ? (
          <p className="v-ui-11 mt-2" style={{ color: status === "ok" ? "#9ad59f" : "#e3a2a2" }}>
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
