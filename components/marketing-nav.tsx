import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button, GeezMark } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";

export function MarketingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full border border-charcoal/10 px-4 py-3 shadow-sm dark:border-cream/10">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <GeezMark className="size-10 rounded-xl text-2xl" />
          <span className="font-display text-2xl font-bold">QalAmharic</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-charcoal/70 dark:text-cream/70 md:flex">
          <Link className="hover:text-leaf dark:hover:text-saffron" href="/course">
            Courses
          </Link>
          <Link className="hover:text-leaf dark:hover:text-saffron" href="/practice">
            Practice
          </Link>
          <Link className="hover:text-leaf dark:hover:text-saffron" href="/leaderboard">
            League
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/login" variant="secondary" className="hidden px-4 py-2.5 sm:inline-flex">
            <LogIn size={17} />
            Login
          </Button>
        </div>
      </nav>
    </header>
  );
}
