import Link from "next/link";
import { ForgotPasswordForm } from "@/components/password-forms";
import { GeezMark } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-charcoal/10 bg-parchment/86 p-6 shadow-gold dark:border-cream/10 dark:bg-charcoal/84">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <GeezMark />
          <span className="font-display text-3xl font-bold">FidelAmharic</span>
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf dark:text-saffron">Password help</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/64 dark:text-cream/64">
          Enter the email for your account. FidelAmharic will create a secure reset link.
        </p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
