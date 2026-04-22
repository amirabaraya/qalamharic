import Link from "next/link";
import { Card, GeezMark } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignupForm } from "@/components/auth-forms";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <GeezMark />
            <span className="font-display text-3xl font-bold">QalAmharic</span>
          </Link>
          <ThemeToggle />
        </div>
        <Card className="pattern">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
              Start free
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold">Build your first Amharic streak</h1>
            <SignupForm />
            <p className="mt-6 text-center text-sm text-charcoal/68 dark:text-cream/68">
              Already learning?{" "}
              <Link href="/login" className="font-bold text-leaf dark:text-saffron">
                Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
