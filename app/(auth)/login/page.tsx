import Link from "next/link";
import { Card, GeezMark } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/auth-forms";

export default function LoginPage() {
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
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold">Continue your Amharic path</h1>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-charcoal/68 dark:text-cream/68">
              New to QalAmharic?{" "}
              <Link href="/signup" className="font-bold text-leaf dark:text-saffron">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
