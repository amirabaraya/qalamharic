"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking that account...");
    setResetUrl("");

    const response = await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const body = (await response.json().catch(() => null)) as { message?: string; resetUrl?: string; error?: string } | null;

    if (!response.ok) {
      setStatus(body?.error ?? "Could not create a reset link.");
      return;
    }

    setStatus(body?.message ?? "Reset link created.");
    setResetUrl(body?.resetUrl ?? "");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Account email</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <Mail size={18} />
          <input className="w-full bg-transparent outline-none" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </span>
      </label>
      <Button className="w-full" type="submit">
        Create reset link <ArrowRight size={18} />
      </Button>
      {status ? <p className="text-center text-sm font-bold text-leaf dark:text-saffron" role="status">{status}</p> : null}
      {resetUrl ? (
        <Link href={resetUrl} className="block rounded-2xl bg-leaf p-4 text-center text-sm font-black text-cream">
          Open password reset
        </Link>
      ) : null}
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Updating your password...");

    const response = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
    setStatus(response.ok ? body?.message ?? "Password updated." : body?.error ?? "Could not update password.");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">New password</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <LockKeyhole size={18} />
          <input className="w-full bg-transparent outline-none" type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
        </span>
      </label>
      <Button className="w-full" type="submit">
        Save new password <ArrowRight size={18} />
      </Button>
      {status ? <p className="text-center text-sm font-bold text-leaf dark:text-saffron" role="status">{status}</p> : null}
      <Link href="/login" className="block text-center text-sm font-bold text-leaf underline-offset-4 hover:underline dark:text-saffron">
        Back to login
      </Link>
    </form>
  );
}
