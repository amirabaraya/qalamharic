import Link from "next/link";
import { ResetPasswordForm } from "@/components/password-forms";
import { GeezMark } from "@/components/ui";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-charcoal/10 bg-parchment/86 p-6 shadow-gold dark:border-cream/10 dark:bg-charcoal/84">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <GeezMark />
          <span className="font-display text-3xl font-bold">FidelAmharic</span>
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf dark:text-saffron">New password</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Choose a new password</h1>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="mt-6 rounded-2xl bg-cream p-4 text-sm font-bold text-charcoal/64 dark:bg-ink/64 dark:text-cream/64">
            This reset link is missing a token. Please create a new reset link.
          </p>
        )}
      </section>
    </main>
  );
}
