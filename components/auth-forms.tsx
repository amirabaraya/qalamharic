"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking your account...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.ok) {
      router.push("/dashboard");
      return;
    }

    setStatus("Could not sign in. Check your email and password, or reset your password.");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Email</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <Mail size={18} />
          <input className="w-full bg-transparent outline-none" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Password</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <LockKeyhole size={18} />
          <input className="w-full bg-transparent outline-none" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </span>
      </label>
      <Button className="w-full" type="submit">
        Login <ArrowRight size={18} />
      </Button>
      <Link href="/forgot-password" className="block text-center text-sm font-bold text-leaf underline-offset-4 hover:underline dark:text-saffron">
        Forgot password?
      </Link>
      {status ? <p className="text-center text-sm font-bold text-leaf dark:text-saffron" role="status">{status}</p> : null}
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating your account...");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(body?.error ?? "Could not create the account. Check database settings and try again.");
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    router.push("/dashboard");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Name</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <UserRound size={18} />
          <input className="w-full bg-transparent outline-none" type="text" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Email</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <Mail size={18} />
          <input className="w-full bg-transparent outline-none" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">Password</span>
        <span className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink">
          <LockKeyhole size={18} />
          <input className="w-full bg-transparent outline-none" type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} />
        </span>
      </label>
      <Button className="w-full" type="submit">
        Create account <ArrowRight size={18} />
      </Button>
      {status ? <p className="text-center text-sm font-bold text-leaf dark:text-saffron" role="status">{status}</p> : null}
    </form>
  );
}
